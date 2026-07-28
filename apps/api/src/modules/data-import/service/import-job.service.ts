import { ImportJob } from "@prisma/client";
import { ImportJobRepository } from "../repository/import-job.repository";

export class ImportJobService
{
    constructor(
        private readonly repository: ImportJobRepository
    ) {}

    async findAll(): Promise<ImportJob[]>
    {
        return this.repository.findAll();
    }
}