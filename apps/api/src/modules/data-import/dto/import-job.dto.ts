import { ImportJobStatus } from "@prisma/client";
import { Id } from "../../../common/types/types";

export type CreateImportJobInput = {
    model: string;
    fileName?: string;
    mimeType?: string;
    sourceDocumentId?: Id | null;
};

export type UpdateImportJobInput = {
    status?: ImportJobStatus;
    totalRows?: number;
    importedRows?: number;
    failedRows?: number;
    errorMessage?: string | null;
    finishedAt?: Date | null;
};