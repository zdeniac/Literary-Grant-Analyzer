import { ImportError } from "../error/import.errors";
import { ImportTargetRepository } from "../repository/import-target.repository";
import { ImportRegistry } from "./import-registry";
import { EntityName } from "../../../common/types/types";

export class ImportRepositoryRegistry extends ImportRegistry<EntityName, ImportTargetRepository<any, any>>
{
    getOrThrow(entity: EntityName): ImportTargetRepository<any, any>
    {
        const repository = this.get(entity);

        if (!repository) {
            throw new ImportError(
                `Missing import repository for ${entity}`
            );
        }

        return repository;
    }
}