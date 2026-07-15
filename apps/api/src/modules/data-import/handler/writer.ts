import { ImportRow, ImportWriter } from "../types/import.types";

export class DataImportWriter implements ImportWriter
{
    constructor(
        private readonly repository: ImportWriter
    ) {}

    createMany(data: ImportRow[]): Promise<number> 
    {
        return this.repository.createMany(data);
    }
}