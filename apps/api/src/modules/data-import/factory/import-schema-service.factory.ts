import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { ImportSchemaService } from "../service/import-schema.service";

export const createImportSchemaService = (registry: ImportBlueprintRegistry) => (
    new ImportSchemaService(registry)
);