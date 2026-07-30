import { ImportController } from "../controller/import.controller";
import { ImportService as ImportService } from "../service/import.service";
import { ImportOptions } from "../types/import.types";
import { createImportRepositories } from "./repositories.factory";
import { createImportBlueprintRegistry } from "./blueprint-registry.factory";
import { createImportLookups } from "./lookups.factory";
import { createImportWriters } from "./writers.factory";
import { createRelationResolver } from "./relation-resolver.factory";
import { createImportEventDispatcher } from "./event-dispatcher.factory";
import { createImportSchemaService } from "./import-schema-service.factory";

export const createImportModule = () => {
    const registry = createImportBlueprintRegistry();
    const importRepos = createImportRepositories();

    const lookups = createImportLookups(importRepos);
    const writers = createImportWriters(importRepos);

    const options: ImportOptions = {
        validation: {
            allowUnknownFields: true,
        }
    };

    const service = new ImportService(
        importRepos.importJob,
        createImportEventDispatcher(),
        registry,
        writers,
        createRelationResolver(lookups),
        options
    );

    const controller = new ImportController(
        service, 
        createImportSchemaService(registry),
    );

    return {
        controller,
        service,
    }
};