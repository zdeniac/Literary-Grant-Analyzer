import { ImportRow, ImportWriter } from "../types/import.types";

export class DataImportWriter<TCreate> implements ImportWriter<TCreate>
{
    constructor(
        private readonly repository: ImportWriter<TCreate>
    ) {}

    createMany(data: TCreate[]): Promise<number> 
    {
        return this.repository.createMany(data);
    }
}