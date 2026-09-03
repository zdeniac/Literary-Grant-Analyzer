import { EntityName } from "../../../common/types/types";

export type LookupConfig = Map<string, LookupFieldConfig>;
export type LookupFieldConfig = {
    normalizers: Normalizer[];
    query?: LookupQueryOptions;
};
export type Normalizer = (value: unknown) => unknown;
export type LookupQueryOptions = {
    // Mode and array type cannot be used together, as they are mutually exclusive. 
    // If both are provided, an error will be thrown.
    // @todo: needs to be rethought or refactored, as this is not a good design. It is confusing and error-prone.
    mode?: 'default' | 'insensitive';
    type?: 'scalar' | 'array';
};

export interface ImportLookupInterface<TEntity>
{
    findManyBy(field: string, values: unknown[], options?: LookupQueryOptions): Promise<TEntity[]>;
    normalize(field: string, value: unknown): unknown;
}
export interface ImportLookupRegistryInterface
{
    getOrThrow(entity: EntityName): ImportLookupInterface<any>;
}