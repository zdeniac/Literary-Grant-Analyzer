import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobEntity } from "../dto/import-job.dto";
import { ListQueryParams } from "../../../common/types/types";

export class ImportJobService
{
    constructor(
        private readonly repository: ImportJobRepository,
    ) {}

    async findAll(query?: ListQueryParams): Promise<ImportJobEntity[]>
    {
        return this.repository.findAll(query);
    }

    async findById(id: number): Promise<ImportJobEntity>
    {
        return this.repository.findByIdOrThrow(id);
    }
}