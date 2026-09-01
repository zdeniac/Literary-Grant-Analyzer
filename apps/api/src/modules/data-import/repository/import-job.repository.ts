import { ImportJobStatus } from "@prisma/client";
import { Id, ListQueryParams } from "../../../common/types/types";
import { Database } from "../../../db/types";
import { CreateImportJobInput, ImportJobEntity, ImportJobEntityWithSourceDocuments, UpdateImportJobInput } from "../dto/import-job.dto";
import { NotFoundError } from "../../../common/errors/http.error";
import { ListDbQueryBuilder } from "../../../db/list-db-query-builder";

export class ImportJobRepository
{
    constructor(
        private readonly entity: Database['importJob'],
        private readonly listQueryBuilder?: ListDbQueryBuilder,
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

    async findByIdWithSourceDocuments(id: Id): Promise<ImportJobEntityWithSourceDocuments>
    {
        const importJob = await this.entity.findUnique({
            where: { id },
            include: {
                sourceDocuments: {
                    include: {
                        sourceDocument: true
                    }
                },
            }
        });

        if (!importJob) {
            throw new NotFoundError();
        }

        return importJob;

    }
    
    async findAllWithSourceDocuments(query?: ListQueryParams): Promise<ImportJobEntityWithSourceDocuments[]>
    {
        return this.entity.findMany({
            include: {
                sourceDocuments: {
                    include: {
                        sourceDocument: {
                            select: {
                                id: true,
                                title: true,
                            }
                        },
                    }
                },
            },
            ...this.listQueryBuilder.build(query)
        });
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