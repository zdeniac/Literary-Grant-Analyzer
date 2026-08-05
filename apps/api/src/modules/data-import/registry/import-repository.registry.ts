import { ImportError } from "../error/import.errors";
import { ImportTargetRepository } from "../repository/import-target.repository";
import { ImportRegistry } from "./import-registry";
import { ImportableEntityName } from "../constants/importable-models";

export class ImportRepositoryRegistry extends ImportRegistry<ImportableEntityName, ImportTargetRepository<any, any>>
{
    getOrThrow(entity: ImportableEntityName): ImportTargetRepository<any, any>
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