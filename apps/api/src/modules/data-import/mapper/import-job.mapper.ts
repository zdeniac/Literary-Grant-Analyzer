import { ImportJobDto, ImportJobEntity } from "../dto/import-job.dto";
import { EntityName } from "../types/import.types";

export const toImportJobDto = (importJob: ImportJobEntity): ImportJobDto => ({
    id: importJob.id,

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
});