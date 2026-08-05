import { ImportableEntityName } from "../constants/importable-models";
import { ImportError } from "../error/import.errors";
import { ImportLookup } from "../handler/import-lookup";
import { ImportRegistry } from "./import-registry";

export class ImportLookupRegistry extends ImportRegistry<ImportableEntityName, ImportLookup<any>>
{
    getOrThrow(entity: ImportableEntityName): ImportLookup<any>
    {
        const lookup = this.get(entity);

        if (!lookup) {
            throw new ImportError(
                `Missing lookup for ${entity}`
            );
        }

        return lookup;
    }
}