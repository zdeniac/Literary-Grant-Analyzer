import { ImportLookupInterface } from "../types/import.types";

export class ImportLookup<TModel> implements ImportLookupInterface<TModel>
{
    constructor(
        private readonly repository: ImportLookupInterface<TModel>
    ) {}
    
    async findManyBy(field: string, values: unknown[]): Promise<TModel[]>
    {
        return this.repository.findManyBy(field, values);
    }
}