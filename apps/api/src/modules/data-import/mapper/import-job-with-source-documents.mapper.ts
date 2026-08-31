import { ImportJobEntityWithSourceDocuments, ImportJobWithSourceDocumentsDto } from "../dto/import-job.dto";

export const toImportJobWithSourceDocumentsDto = (
    importJob: ImportJobEntityWithSourceDocuments
): ImportJobWithSourceDocumentsDto => ({
    id: importJob.id,

    model: importJob.model,
    fileName: importJob.fileName,
    mimeType: importJob.mimeType,

    status: importJob.status,

    totalRows: importJob.totalRows,
    importedRows: importJob.importedRows,
    failedRows: importJob.failedRows,

    errorMessage: importJob.errorMessage,

    startedAt: importJob.startedAt,
    finishedAt: importJob.finishedAt,

    sourceDocuments: importJob.sourceDocuments.map(
        ({ sourceDocument }) => ({ ...sourceDocument })
    ),
});