import { ImportJob, ImportJobStatus } from "@prisma/client";
import { Id } from "../../../common/types/types";
import { PrismaDatabase } from "../../../db/types";
import { CreateImportJobInput, UpdateImportJobInput } from "../dto/import-job.dto";

export class ImportJobRepository
{
    constructor(
        private readonly model: PrismaDatabase['importJob']
    ) {}

    async create(data: CreateImportJobInput): Promise<ImportJob>
    {
        return this.model.create({
            data: {
                model: data.model,
                fileName: data.fileName,
                mimeType: data.mimeType,
                sourceDocumentId: data.sourceDocumentId,
                status: ImportJobStatus.RUNNING,
                totalRows: data.totalRows,
            }
        });
    }

    async findById(id: Id): Promise<ImportJob | null>
    {
        return this.model.findUnique({
            where: {
                id
            }
        });
    }
    
    async findAll(): Promise<ImportJob[]>
    {
        return this.model.findMany();
    }

    async update(id: Id,data: UpdateImportJobInput): Promise<ImportJob>
    {
        return this.model.update({
            where: {
                id
            },
            data
        });
    }

    async complete(id: Id, importedRows: number): Promise<ImportJob>
    {
        return this.model.update({
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

    async fail(id: Id, input: { errorMessage: string; failedRows?: number; }): Promise<ImportJob>
    {
        return this.model.update({
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