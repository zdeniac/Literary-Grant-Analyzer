import { ImportWriterInterface } from "../types/service.types";

export class ImportWriter<TCreate> implements ImportWriterInterface<TCreate>
{
    constructor(
        private readonly repository: ImportWriterInterface<TCreate>
    ) {}

    async createMany(data: TCreate[]): Promise<number> 
    {
        return this.repository.createMany(data);
    }
}