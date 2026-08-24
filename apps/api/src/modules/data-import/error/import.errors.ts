import { AppError } from "../../../common/errors/app.error";
import { ImportFileRowError } from "../types/error.types";

export class ImportError extends AppError 
{
    static statusCode = 500;
    static code = 'IMPORT_ERROR';

    constructor(
        readonly message: string,
        statusCode = ImportError.statusCode,
        code = ImportError.code,
    ) {
        super(message, statusCode, code);
        this.name = 'ImportError';
    }
}

export class ImportDataValidationError extends ImportError 
{
    static code = 'IMPORT_VALIDATION_ERROR';
    static statusCode = 422;

    constructor(
        readonly errors: ImportFileRowError[] = [],
        readonly message = 'Import data validation failed',
        readonly code = ImportDataValidationError.code,
    ) {
        super(
            message, 
            ImportDataValidationError.statusCode, 
            code,
        );
        this.name = 'ImportValidationError';
    }
}

export class ImportRelationError extends ImportDataValidationError
{
    static code = 'IMPORT_RELATION_ERROR';

    constructor(
        readonly errors: ImportFileRowError[] = [],
    ) {
        super(
            errors,
            'Invalid data relation',
            ImportRelationError.code,
        );
        this.name = ImportRelationError.name;
    }
}

export class ImportEmptyFileError extends ImportError
{
    static code = 'IMPORT_EMPTY_FILE_ERROR';
    static statusCode = 422;

    constructor() {
        super(
            'Import file contains no rows.',
            ImportEmptyFileError.statusCode,
            ImportEmptyFileError.code,
        );
        this.name = ImportEmptyFileError.name;
    }
}
