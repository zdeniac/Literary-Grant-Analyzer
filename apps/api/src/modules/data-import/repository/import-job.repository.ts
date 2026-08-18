import { ImportJobStatus } from "@prisma/client";
import { Id, ListQueryParams } from "../../../common/types/types";
import { Database } from "../../../db/types";
import { CreateImportJobInput, ImportJobEntity, UpdateImportJobInput } from "../dto/import-job.dto";
import { NotFoundError } from "../../../common/errors/http.error";
import { ListDbQueryBuilder } from "../../../db/list-db-query-builder";

export class ImportJobRepository
{
    constructor(
        private readonly entity: Database['importJob'],
        private readonly listQueryBuilder: ListDbQueryBuilder,
    ) {}

    async create(data: CreateImportJobInput): Promise<ImportJobEntity>
    {
        return this.entity.create({
            data: {
                model: data.model,
                fileName: data.fileName,
                mimeType: data.mimeType,
                status: ImportJobStatus.RUNNING,
                totalRows: data.totalRows,
            }
        });
    }

    async findById(id: Id): Promise<ImportJobEntity | null>
    {
        return this.entity.findUnique({
            where: {
                id
            }
        });
    }

    async findByIdOrThrow(id: Id): Promise<ImportJobEntity>
    {
        const importJob = await this.findById(id);

        if (!importJob) {
            throw new NotFoundError();
        }

        return importJob;
    }
    
    async findAll(query?: ListQueryParams): Promise<ImportJobEntity[]>
    {
        return this.entity.findMany({ ...this.listQueryBuilder.build(query) });
    }

    async update(id: Id,data: UpdateImportJobInput): Promise<ImportJobEntity>
    {
        return this.entity.update({
            where: {
                id
            },
            data
        });
    }

    async complete(id: Id, importedRows: number): Promise<ImportJobEntity>
    {
        return this.entity.update({
            where: {
                id
            },
            data: {
                status: ImportJobStatus.COMPLETED,
                importedRows,
                finishedAt: new Date(),
            }
        });
    }

    async fail(id: Id, input: { errorMessage: string; failedRows?: number; }): Promise<ImportJobEntity>
    {
        return this.entity.update({
            where: {
                id
            },
            data: {
                status: ImportJobStatus.FAILED,
                failedRows: input?.failedRows ?? 0,
                errorMessage: input.errorMessage,
                finishedAt: new Date()
            }
        });
    }
}