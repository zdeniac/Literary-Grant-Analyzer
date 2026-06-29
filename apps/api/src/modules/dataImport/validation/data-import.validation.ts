import { ZodType } from "zod";
import { ImportRowError, ImportValidationError } from "../error/import.errors";
import { ImportField, ImportHeader, ImportRow } from "../types/import.types";

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

export function validateHeaders(headers: ImportHeader, fields: ImportField[]): void
{
    const fieldNames = fields.map(
        field => field.name
    );
    // Find the missing header fields compared to the fields
    const missing = fieldNames.filter(
        field => !headers.includes(field)
    );
    // Find the missing fields compared to the header
    const unknown = headers.filter(
        header => !fieldNames.includes(header)
    );

    const errors: ImportRowError[] = [];

    if (missing.length) {
        errors.push({
            row: 1,
            issues: missing.map(field => ({
                message: `Missing field: ${field}`
            }))
        });
    }

    if (unknown.length) {
        errors.push({
            row: 1,
            issues: unknown.map(field => ({
                message: `Unknown field: ${field}`
            }))
        });
    }
    if (errors.length) throw new ImportValidationError(errors);
}

