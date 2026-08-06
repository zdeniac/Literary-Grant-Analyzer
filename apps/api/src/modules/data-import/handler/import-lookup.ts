import { EntityName } from "../../../common/types/types";
import { ImportLookupInterface, LookupFieldConfig } from "../types/import-lookup.types";

export class ImportLookup<TEntity> implements ImportLookupInterface<TEntity>
{
    constructor(
        public readonly entity: EntityName,
        private readonly repository: ImportLookupInterface<TEntity>,
        private readonly lookupRules?: Map<string, LookupFieldConfig>
    ) {}
    
    async findManyBy(field: string, values: unknown[]): Promise<TEntity[]>
    {
        const config = this.lookupRules?.get(field);

        return this.repository.findManyBy(
            field,
            config ? this.normalizeValue(field, values) : values,
            config?.query
        ); 
    }

    normalize(field: string, value: unknown): unknown
    {
        return this.normalizeValue(field, [value])[0];
    }

    private normalizeValue(field: string, values: unknown[]): unknown[]
    {
        const config = this.lookupRules?.get(field);

        if (!config) {
            throw new Error(`Missing normalizers for ${field} in lookup for entity ${this.entity}.`);
        }

        let result = values;
        for (const normalizer of config.normalizers) {
            result = result.map(normalizer);
        }

        return result;
    }
}