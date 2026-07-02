import { ImportError } from "../error/import.errors";
import { Blueprint } from "../types/import.types";

export class ImportBlueprintRegistry {
    private readonly blueprints = new Map<string, Blueprint>();

    constructor(...blueprints: Blueprint[])
    {
        blueprints.forEach(
            blueprint => {
                this.blueprints.set(blueprint.model, blueprint);
            }
        );
    }

    get(model: string): Blueprint | undefined
    {
        return this.blueprints.get(model);
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