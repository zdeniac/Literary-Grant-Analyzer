import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobEntityWithSourceDocuments } from "../dto/import-job.dto";
import { ListQueryParams } from "../../../common/types/types";

export class ImportJobService
{
    constructor(
        private readonly repository: ImportJobRepository,
    ) {}

    async getList(query?: ListQueryParams): Promise<ImportJobEntityWithSourceDocuments[]>
    {
        return this.repository.findAllWithSourceDocuments(query);
    }

    async findByIdWithSourceDocuments(id: number): Promise<ImportJobEntityWithSourceDocuments>
    {
        return this.repository.findByIdWithSourceDocuments(id);
    }
}