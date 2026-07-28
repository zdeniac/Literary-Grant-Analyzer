import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { ImportSchema } from "../types/import.types";

export class ImportSchemaService
{
    constructor(
        private readonly blueprintRegistry: ImportBlueprintRegistry
    ) {}

    public getSchema(model: string): ImportSchema
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