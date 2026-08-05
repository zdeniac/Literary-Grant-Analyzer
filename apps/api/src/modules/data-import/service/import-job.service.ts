import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobEntity } from "../dto/import-job.dto";

export class ImportJobService
{
    constructor(
        private readonly repository: ImportJobRepository
    ) {}

    async findAll(): Promise<ImportJobEntity[]>
    {
        return this.repository.findAll();
    }
}