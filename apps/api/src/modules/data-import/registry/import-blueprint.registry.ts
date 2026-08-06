import { ImportableEntityName } from "../constants/importable-models";
import { ImportError } from "../error/import.errors";
import { ImportBlueprint } from "../types/import-blueprint.types";
import { ImportRegistry } from "./import-registry";

export class ImportBlueprintRegistry extends ImportRegistry<ImportableEntityName, ImportBlueprint>
{
    getOrThrow(entity: ImportableEntityName): ImportBlueprint
    {
        const blueprint = this.get(entity);

        if (!blueprint) {
            throw new ImportError(`Unknown import entity: ${entity}`);
        }

        return blueprint;
    }
}