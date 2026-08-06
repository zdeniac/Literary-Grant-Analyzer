import { expect } from "vitest";
import { ImportJobEntity } from "../../../../src/modules/data-import/dto/import-job.dto";
import { ImportFile } from "../../../../src/modules/data-import/types/import.types";
import { ImportJobStatus } from "@prisma/client";

export function expectFinishedImportJobWithStatus(
    job: ImportJobEntity,
    expected: {
        fileName: string;
        mimeType: string;
        totalRows: number;
        importedRows: number;
        failedRows?: number;
        errorMessage?: string;
    },
    status: ImportJobStatus = ImportJobStatus.COMPLETED
): void {
    expect(job.fileName).toBe(expected.fileName);
    expect(job.mimeType).toBe(expected.mimeType);
    expect(job.finishedAt).not.toBeNull();
    expect(job.totalRows).toBe(expected.totalRows);
    expect(job.importedRows).toBe(expected.importedRows);
    expect(job.failedRows).toBe(expected?.failedRows ?? 0);
    expect(job.status).toBe(status);

    if (expected.errorMessage) {
        expect(job.errorMessage).toContain(expected.errorMessage);
    }
}

export function createImportFile(
    fileName: string,
    rows: Array<Record<string, unknown>>,
    mimeType: string = 'text/csv',
    header: string[] = [],
): ImportFile {
    let newHeader = header.length > 0 
        ? header 
        : Object.keys(rows[0] ?? {});

    return {
        fileName,
        mimeType,
        header: newHeader,
        rows,
    };
}