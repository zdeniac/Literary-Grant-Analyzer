import { ImportJobStatus } from "@prisma/client";
import { Id } from "../../../common/types/types";
import { ModelName } from "../types/import.types";

export type ImportJobDto = {
    id: Id;

    sourceDocumentId: Id | null;

    model: ModelName;
    fileName: string | null;
    mimeType: string | null;

    status: ImportJobStatus;

    totalRows: number;
    importedRows: number | null;
    failedRows: number | null;

    errorMessage: string | null;

    startedAt: Date;
    finishedAt: Date | null;

    createdAt: Date;
};

export type CreateImportJobInput = {
    model: ModelName;

    totalRows?: number;
    fileName?: string;
    mimeType?: string;

    sourceDocumentId?: Id | null;
};

export type UpdateImportJobInput = {
    status?: ImportJobStatus;

    totalRows?: number;
    importedRows?: number;
    failedRows?: number;

    errorMessage?: string;

    finishedAt?: Date;
};