import { ImportError } from "../error/data-import.errors";
import { Blueprint } from "../types/data-import.types";

export class ImportBlueprintRegistry {
    constructor(
        private readonly blueprints: Record<string, Blueprint>
    ) {}

    get(model: string): Blueprint | undefined
    {
        return this.blueprints[model];
    }

    has(model: string): boolean
    {
        return model in this.blueprints;
    }

    getOrThrow(model: string): Blueprint
    {
        const blueprint = this.get(model);

        if (!blueprint) {
            throw new ImportError(
                `Unknown import model: ${model}`
            );
        }

        return blueprint;
    }

    getAll(): [string, Blueprint][]
    {
        return Object.entries(this.blueprints);
    }
}