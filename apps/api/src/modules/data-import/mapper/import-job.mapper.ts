import { ImportJob } from "@prisma/client";
import { ImportJobDto } from "../dto/import-job.dto";

export const toImportJob = (importJob: ImportJob): ImportJobDto => ({
    id: importJob.id,
    sourceDocumentId: importJob.sourceDocumentId,

    model: importJob.model,
    fileName: importJob.fileName,

    status: importJob.status,

    mimeType: importJob.mimeType,
    importedRows: importJob.importedRows,

    totalRows: importJob.totalRows,
    failedRows: importJob.failedRows,
    errorMessage: importJob.errorMessage,

    startedAt: importJob.startedAt,
    finishedAt: importJob.finishedAt,

    createdAt: importJob.createdAt,
});