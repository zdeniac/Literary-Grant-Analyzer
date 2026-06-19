import { AppError } from "../../common/error/app.error";
import { ImportError } from "./data-import.types";

export class ImportValidationError extends AppError {
    constructor(public errors: ImportError[])
    {
        super('IMPORT_VALIDATION_ERROR');
        // class name for tracing
        this.name = 'ImportValidationError';
    }
}