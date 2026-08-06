import { ImportableEntityName } from "../constants/importable-models";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { ImportSchema } from "../types/import.types";

export class ImportSchemaService
{
    constructor(
        private readonly blueprintRegistry: ImportBlueprintRegistry
    ) {}

    public getSchema(entity: ImportableEntityName): ImportSchema
    {
        const blueprint = this.blueprintRegistry.getOrThrow(entity);

        return {
            fields: blueprint.fields,
            acceptedFormats: [
                {
                    mimeType: 'text/csv',
                    extension: '.csv'
                }
            ],
        };
    }
}