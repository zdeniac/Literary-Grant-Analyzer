import { ImportJobStatus } from "@prisma/client";
import { ImportableEntityName } from "../constants/importable-models";
import { Id } from "../../../common/types/types";
import { SourceDocumentDto, SourceDocumentEntity } from "../../source-document/dto/source-document.dto";

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

export type ImportJobEntityWithSourceDocuments = ImportJobEntity & {
    sourceDocuments: {
        importJobId: number;
        sourceDocumentId: number;
        sourceDocument: {
            id: number;
            title: string;
        } | SourceDocumentEntity;
    }[];
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

export type ImportJobWithSourceDocumentsDto = ImportJobDto & {
    sourceDocuments:
        | Pick<SourceDocumentDto, 'id' | 'title'>[]
        | SourceDocumentDto[];
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