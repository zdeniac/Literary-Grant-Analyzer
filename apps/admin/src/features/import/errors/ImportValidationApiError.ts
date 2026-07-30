export type ImportRowError = {
    row: number;
    issues: ImportIssue[];
};

type ImportIssue = {
    message: string;
    field?: string;
    value?: unknown;
};

export class ImportValidationApiError extends Error
{
    static readonly codes = ['IMPORT_VALIDATION_ERROR', 'IMPORT_RELATION_ERROR'];

    constructor(
        readonly errors: ImportRowError[],
    ) {
        super('Import validation failed.');
        this.name = 'ImportValidationApiError';
    }
}
