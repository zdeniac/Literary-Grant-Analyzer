import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { ImportSchema, EntityName } from "../types/import.types";

export class ImportSchemaService
{
    constructor(
        private readonly blueprintRegistry: ImportBlueprintRegistry
    ) {}

    public getSchema(entity: EntityName): ImportSchema
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