import { AppError } from "../../../common/errors/app.error";
import { ImportRowError } from "../types/import.types";

export class ImportError extends AppError 
{
    constructor(readonly message: string)
    {
        super(message);
        this.name = 'ImportError';
    }
}

export class ImportValidationError extends AppError 
{
    constructor(
        readonly errors: ImportRowError[] = [],
        readonly message = 'IMPORT_VALIDATION_ERROR'
    ) {
        super(message);
        // class name for tracing
        this.name = 'ImportValidationError';
    }
}
