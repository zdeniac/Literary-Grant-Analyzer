import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { Blueprint } from "../types/data-import.types";

export class ImportSchemaService {
    constructor(
        private readonly blueprintRegistry: ImportBlueprintRegistry
    ) {}

    public getSchema(model: string): { fields: Blueprint, acceptedFormats: string[] }
    {
        const blueprint = this.blueprintRegistry.getOrThrow(model);

        return {
            fields: blueprint,
            acceptedFormats: [
                "csv"
            ],
        };
    }
}