import { AppError } from "../../../common/errors/app.error";

export type ImportRowError = {
    row: number;
    issues: unknown[];
};

export class ImportValidationError extends AppError {
    constructor(public errors: ImportRowError[])
    {
        super('IMPORT_VALIDATION_ERROR');
        // class name for tracing
        this.name = 'ImportValidationError';
    }
}

export class ImportError extends AppError {
    constructor(public message: string)
    {
        super(message);
        this.name = 'ImportError';
    }
}
