import { ImportLookupInterface, LookupFieldConfig } from "../types/import.types";

export class ImportLookup<TModel> implements ImportLookupInterface<TModel>
{
    constructor(
        private readonly repository: ImportLookupInterface<TModel>,
        private readonly lookupRules?: Map<string, LookupFieldConfig>
    ) {}
    
    async findManyBy(field: string, values: unknown[]): Promise<TModel[]>
    {
        const config = this.lookupRules?.get(field);

        return this.repository.findManyBy(
            field,
            config ? this.normalize(field, values) : values,
            config?.query
        );    
    }

    private normalize(field: string, values: unknown[]): unknown[] 
    {
        const config = this.lookupRules?.get(field);

        if (!config) {
            throw new Error(`Missing normalizers for ${field} in Lookup.`);
        }

        let result = values;
        for (const normalizer of config.normalizers) {
            result = result.map(normalizer);
        }

        return result;
    }
}