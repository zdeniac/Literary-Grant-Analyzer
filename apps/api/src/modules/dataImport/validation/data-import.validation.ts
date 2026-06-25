import z from "zod";
import { ImportRowError, ImportValidationError } from "../error/data-import.errors";
import { ImportField } from "../types/data-import.types";

export function validateRows(
    rows: Record<string, unknown>[],
    schema: z.ZodTypeAny
): Record<string, unknown>[] {
    const validated: Record<string, unknown>[] = [];
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
        
        validated.push(result.data as Record<string, unknown>);
    });

    if (errors.length) throw new ImportValidationError(errors);

    return validated;
}

export function validateHeaders(headers: string[], fields: ImportField[]): void
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

