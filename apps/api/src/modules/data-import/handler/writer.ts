import { ImportWriter } from "../types/import.types";

export class DataImportWriter<TCreate> implements ImportWriter<TCreate>
{
    constructor(
        private readonly repository: ImportWriter<TCreate>
    ) {}

    async createMany(data: TCreate[]): Promise<number> 
    {
        return this.repository.createMany(data);
    }
}