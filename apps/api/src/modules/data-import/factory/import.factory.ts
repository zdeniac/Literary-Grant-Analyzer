import { ImportController } from "../controller/import.controller";
import { ImportService as ImportService } from "../service/import.service";
import { ImportOptions } from "../types/import.types";
import { createImportRepositories } from "./repositories.factory";
import { createImportBlueprintRegistry } from "./blueprint-registry.factory";
import { createImportLookups } from "./lookups.factory";
import { createImportWriters } from "./writers.factory";
import { createSimpleRelationResolver } from "./simple-relation-resolver.factory";
import { createImportSchemaService } from "./import-schema-service.factory";
import { createCompositeRelationResolver } from "./composite-relation-resolver.factory";
import { repositoryContainer } from "../../../db/repositories/container";
import { prisma } from "../../../db/prisma";
import { ImportWorkflowService } from "../service/import-workflow-service";
import { createSourceDocumentService } from "../../source-document/source-document.factories";
import { createImportJobSourceDocumentService } from "../../import-job-source-document/import-job-source-document.factories";

export const createImportModule = () => {
    const registry = createImportBlueprintRegistry();
    const repositories = repositoryContainer(prisma);
    const importRepos = createImportRepositories();

    const lookups = createImportLookups(importRepos);
    const writers = createImportWriters(importRepos);

    const options: ImportOptions = {
        validation: {
            allowUnknownFields: true,
        }
    };

    const relationResolverRegistry = {
        simple: createSimpleRelationResolver(lookups),
        composite: createCompositeRelationResolver(lookups),
    };

    const service = new ImportService(
        repositories.importJob,
        registry,
        writers,
        relationResolverRegistry,
        options
    );

    const importWorkflowService = new ImportWorkflowService(
        service,
        createSourceDocumentService(prisma),
        createImportJobSourceDocumentService(prisma),
    )

    const controller = new ImportController(
        importWorkflowService, 
        createImportSchemaService(registry),
    );

    return {
        controller,
        service,
    }
};