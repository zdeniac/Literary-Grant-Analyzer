export type LookupConfig = Map<string, LookupFieldConfig>;
export type LookupFieldConfig = {
    normalizers: Normalizer[];
    query?: LookupQueryOptions;
};
export type Normalizer = (value: unknown) => unknown;
export type LookupQueryOptions = {
    mode: 'default' | 'insensitive';
};

export interface ImportLookupInterface<TEntity>
{
    findManyBy(field: string, values: unknown[], options?: LookupQueryOptions): Promise<TEntity[]>;
}
