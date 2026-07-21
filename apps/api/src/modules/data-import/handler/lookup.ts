import { ImportLookup } from "../types/import.types";

export class DataImportLookup<TModel> implements ImportLookup<TModel>
{
    constructor(
        private readonly repository: ImportLookup<TModel>
    ) {}
    
    async findManyBy(field: string, values: unknown[]): Promise<TModel[]>
    {
        return this.repository.findManyBy(field, values);
    }
}