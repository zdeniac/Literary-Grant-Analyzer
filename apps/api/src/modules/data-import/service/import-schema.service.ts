import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { ImportSchema, ModelName } from "../types/import.types";

export class ImportSchemaService
{
    constructor(
        private readonly blueprintRegistry: ImportBlueprintRegistry
    ) {}

    public getSchema(model: ModelName): ImportSchema
    {
        const blueprint = this.blueprintRegistry.getOrThrow(model);

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