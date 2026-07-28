import { ImportError } from "../error/import.errors";
import { Blueprint, ModelName } from "../types/import.types";

export class ImportBlueprintRegistry {
    private readonly blueprints = new Map<ModelName, Blueprint>();

    constructor(...blueprints: Blueprint[])
    {
        blueprints.forEach(
            blueprint => {
                this.blueprints.set(blueprint.model, blueprint);
            }
        );
    }

    get(model: ModelName): Blueprint | undefined
    {
        return this.blueprints.get(model);
    }

    has(model: ModelName): boolean
    {
        return this.blueprints.has(model);
    }
    
    getOrThrow(model: ModelName): Blueprint
    {
        const blueprint = this.get(model);

        if (!blueprint) {
            throw new ImportError(
                `Unknown import model: ${model}`
            );
        }

        return blueprint;
    }

    getAll(): [ModelName, Blueprint][]
    {
        return Object.entries(this.blueprints);
    }
}