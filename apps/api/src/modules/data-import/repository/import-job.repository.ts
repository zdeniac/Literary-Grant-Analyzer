import { ImportJobStatus } from "@prisma/client";
import { Id } from "../../../common/types/types";
import { Database } from "../../../db/types";
import { CreateImportJobInput, ImportJobEntity, UpdateImportJobInput } from "../dto/import-job.dto";

export class ImportJobRepository
{
    constructor(
        private readonly entity: Database['importJob']
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
    
    async findAll(): Promise<ImportJobEntity[]>
    {
        return this.entity.findMany();
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