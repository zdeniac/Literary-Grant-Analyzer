import { ImportController } from "../controller/import.controller";
import { ImportService as ImportService } from "../service/import.service";
import { ImportOptions } from "../types/import.types";
import { createImportBlueprintRegistry } from "./import-blueprint-registry.factory";
import { createSimpleRelationResolver } from "./simple-relation-resolver.factory";
import { createImportSchemaService } from "./import-schema-service.factory";
import { createCompositeRelationResolver } from "./composite-relation-resolver.factory";
import { repositoryContainer } from "../../../db/repositories/container";
import { prisma } from "../../../db/prisma";
import { ImportWorkflowService } from "../service/import-workflow-service";
import { createSourceDocumentService } from "../../source-document/source-document.factories";
import { createImportJobSourceDocumentService } from "../../import-job-source-document/import-job-source-document.factories";
import { createImportLookupRegistry } from "./import-lookup-registry.factory";
import { createImportRepositoryRegistry } from "./import-repository-registry.factory";
import { createImportWriterRegistry } from "./writers.factory";

export const createImportModule = () => {
    const repositories = repositoryContainer(prisma);

    const blueprintRegistry = createImportBlueprintRegistry();

    const importRepositoryRegistry = createImportRepositoryRegistry();
    const lookupRegistry = createImportLookupRegistry(importRepositoryRegistry);
    const writers = createImportWriterRegistry(importRepositoryRegistry);

    const options: ImportOptions = {
        validation: {
            allowUnknownFields: true,
        }
    };

    const relationResolverRegistry = {
        simple: createSimpleRelationResolver(lookupRegistry),
        composite: createCompositeRelationResolver(lookupRegistry),
    };

    const service = new ImportService(
        repositories.importJob,
        blueprintRegistry,
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
        createImportSchemaService(blueprintRegistry),
    );

    return {
        controller,
        service,
    }
};