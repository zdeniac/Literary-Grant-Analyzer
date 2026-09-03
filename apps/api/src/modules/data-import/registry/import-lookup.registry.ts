import { EntityName } from "../../../common/types/types";
import { ImportError } from "../error/import.errors";
import { ImportLookup } from "../handler/import-lookup";
import { ImportLookupInterface, ImportLookupRegistryInterface } from "../types/import-lookup.types";
import { ImportRegistry } from "./import-registry";

export class ImportLookupRegistry 
    extends ImportRegistry<EntityName, ImportLookup<any>> 
    implements ImportLookupRegistryInterface
{
    getOrThrow(entity: EntityName): ImportLookupInterface<any>
    {
        const lookup = this.get(entity);

        if (!lookup) {
            throw new ImportError(`Missing lookup for ${entity}.`);
        }

        return lookup;
    }
}