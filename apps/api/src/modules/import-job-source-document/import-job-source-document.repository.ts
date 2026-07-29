import { PrismaDatabase } from "../../db/types";
import { CreateImportJobSourceDocumentDto } from "./dto/import-job-source-document.dto";

export class ImportJobSourceDocumentRepository
{
    constructor(
        private readonly model: PrismaDatabase['importJobSourceDocument']
    ) {}

    async createMany(data: CreateImportJobSourceDocumentDto[]): Promise<number>
    {
        const total = await this.model.createMany({ data });

        return total.count;
    }
}