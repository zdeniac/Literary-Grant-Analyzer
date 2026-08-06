import type { ImportRowError } from "../types/error.types";

export class ImportValidationApiError extends Error
{
    static readonly codes = ['IMPORT_VALIDATION_ERROR', 'IMPORT_RELATION_ERROR', 'IMPORT_EMPTY_FILE_ERROR'];

    constructor(
        readonly errors: ImportRowError[],
    ) {
        super('Import validation failed.');
        this.name = 'ImportValidationApiError';
    }
}
