import { ImportJobStatus } from "@prisma/client";
import { ImportableEntityName } from "../constants/importable-models";
import { Id } from "../../../common/types/types";

export type ImportJobEntity = {
    id: number;

    model: string;
    fileName: string | null;
    mimeType: string | null;

    status: ImportJobStatus;

    totalRows: number;
    importedRows: number | null;
    failedRows: number | null;

    errorMessage: string | null;

    startedAt: Date;
    finishedAt: Date | null;
};

export type ImportJobDto = {
    id: Id;

    model: ImportableEntityName;
    fileName: string | null;
    mimeType: string | null;

    status: ImportJobStatus;

    totalRows: number;
    importedRows: number | null;
    failedRows: number | null;

    errorMessage: string | null;

    startedAt: Date;
    finishedAt: Date | null;
};

export type CreateImportJobInput = {
    model: ImportableEntityName;

    totalRows?: number;
    fileName?: string;
    mimeType?: string;
};

export type UpdateImportJobInput = {
    status?: ImportJobStatus;

    totalRows?: number;
    importedRows?: number;
    failedRows?: number;

    errorMessage?: string;

    finishedAt?: Date;
};