import z, { ZodType } from "zod";
import { ImportRowError, ImportValidationError } from "../error/import.errors";
import { ImportField, ImportHeader, ImportOptions, ImportRow } from "../types/import.types";

export const modelNameSchema = z
    .string()
    .regex(
        /^[a-z][a-zA-Z0-9]*$/, 
        'ModelName must be camelCase'
    );

export function validateRows<T extends ImportRow>(
    rows: ImportRow[],
    schema: ZodType<T>
): ImportRow[] {
    const validated: ImportRow[] = [];
    const errors: ImportRowError[] = [];

    rows.forEach((row, index) => {
        const result = schema.safeParse(row);

        if (!result.success) {
            errors.push({
                row: index + 2,
                issues: result.error.issues
            });

            return;
        }
        
        validated.push(result.data);
    });

    if (errors.length) throw new ImportValidationError(errors);

    return validated;
}

export function validateHeaders(
    headers: ImportHeader, 
    fields: ImportField[],
    allowUnknownFields = false,
): void {
    const errors: ImportRowError[] = [];

    const fieldNames = fields.map(
        field => field.name
    );

    // Find the missing header fields compared to the fields
    const missing = fieldNames.filter(
        field => !headers.includes(field)
    );

    if (missing.length) {
        errors.push({
            row: 1,
            issues: missing.map(field => ({
                message: `Missing field: ${field}`
            }))
        });
    }

    // Find the missing fields compared to the header
    let unexpectedFields: ImportHeader = [];
    if (!allowUnknownFields) {
        unexpectedFields = headers.filter(
            header => !fieldNames.includes(header)
        );

        errors.push({
            row: 1,
            issues: unexpectedFields.map(field => ({
                message: `Unknown field: ${field}`
            }))
        });

    }
    
    if (missing.length || unexpectedFields.length) {
        throw new ImportValidationError(errors);
    }
}

