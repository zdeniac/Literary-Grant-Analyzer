import { ImportableEntityName } from "../constants/importable-models";
import { ImportError } from "../error/import.errors";
import { Blueprint } from "../types/import.types";
import { ImportRegistry } from "./import-registry";

export class ImportBlueprintRegistry extends ImportRegistry<ImportableEntityName, Blueprint>
{
    getOrThrow(entity: ImportableEntityName): Blueprint
    {
        const blueprint = this.get(entity);

        if (!blueprint) {
            throw new ImportError(`Unknown import entity: ${entity}`);
        }

        return blueprint;
    }
}