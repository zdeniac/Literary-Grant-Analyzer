import { EntityName } from "../../../common/types/types";
import { ImportError } from "../error/import.errors";
import { ImportLookup } from "../handler/import-lookup";
import { ImportRegistry } from "./import-registry";

export class ImportLookupRegistry extends ImportRegistry<EntityName, ImportLookup<any>>
{
    getOrThrow(entity: EntityName): ImportLookup<any>
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