import { EntityName } from "../../../common/types/types";
import { ImportLookup } from "../handler/import-lookup";
import { ImportRepositoryRegistry } from "../registry/import-repository.registry";
import { LookupConfig } from "../types/import-lookup.types";

export const createImportLookup = (entity: EntityName, repos: ImportRepositoryRegistry, config?: LookupConfig) => (
    new ImportLookup(entity, repos.getOrThrow(entity), config)
);