import { Database } from "../../db/types";
import { CreateImportJobSourceDocumentDto } from "./dto/import-job-source-document.dto";

export class ImportJobSourceDocumentRepository
{
    constructor(
        private readonly entity: Database['importJobSourceDocument']
    ) {}

    async createMany(data: CreateImportJobSourceDocumentDto[]): Promise<number>
    {
        const total = await this.entity.createMany({ data });

        return total.count;
    }
}