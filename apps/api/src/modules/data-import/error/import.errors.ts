import { AppError } from "../../../common/errors/app.error";
import { ImportRowError } from "../types/error.types";

export class ImportError extends AppError 
{
    static code = 'IMPORT_ERROR';
    static statusCode = 500;

    constructor(readonly message: string, statusCode = ImportError.statusCode)
    {
        super(message, statusCode);
        this.name = 'ImportError';
    }
}

export class ImportValidationError extends ImportError 
{
    static code = 'IMPORT_VALIDATION_ERROR';
    static statusCode = 422;

    constructor(
        readonly errors: ImportRowError[] = [],
        readonly message = ImportValidationError.code
    ) {
        super(message, ImportValidationError.statusCode);
        this.name = 'ImportValidationError';
    }
}

export class ImportRelationError extends ImportValidationError
{
    static code = 'IMPORT_RELATION_ERROR';
    static statusCode = 422;

    constructor(
        readonly errors: ImportRowError[] = [],
    ) {
        super(errors, ImportRelationError.code);
        this.name = ImportValidationError.name;
    }
}

export class ImportEmptyFileError extends ImportValidationError
{
    static code = 'IMPORT_EMPTY_FILE_ERROR';
    static statusCode = 422;

    constructor(
        readonly message = 'Import file contains no rows.'
    ) {
        super([], message);
        this.name = ImportEmptyFileError.name;
    }
}
