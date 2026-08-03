import { ZodType } from "zod";
import { ImportValidationError } from "../error/import.errors";
import { ImportField, ImportHeader, ImportRow, ImportRowError } from "../types/import.types";

export function validateRows<T extends ImportRow>(
    rows: ImportRow[],
    schema: ZodType<T>
): T[] {
    const validated: T[] = [];
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
    const missingHeaderFields = fieldNames.filter(
        field => !headers.includes(field)
    );

    if (missingHeaderFields.length) {
        errors.push({
            row: 1,
            issues: missingHeaderFields.map(field => ({
                message: `Missing field: ${field}`
            }))
        });
    }

    // Find the missing fields compared to the header
    let unexpectedHeaderFields: ImportHeader = [];
    if (!allowUnknownFields) {
        unexpectedHeaderFields = headers.filter(
            header => !fieldNames.includes(header)
        );

        if (unexpectedHeaderFields.length) {
            errors.push({
                row: 1,
                issues: unexpectedHeaderFields.map(field => ({
                    message: `Unknown field: ${field}`
                }))
            });
        }
    }

    if (missingHeaderFields.length || unexpectedHeaderFields.length) {
        throw new ImportValidationError(errors);
    }
}

