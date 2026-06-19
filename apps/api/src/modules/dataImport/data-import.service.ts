import z from "zod";
import { ModelBlueprint } from "./data-import.blueprints";
import { ImportError, ImportFile } from "./data-import.types";
import { ImportValidationError } from "./data-import.errors";

export class DataImportService {
    constructor(
        private readonly blueprints: Record<string, ModelBlueprint>
    ) {}

    async import(modelName: string, file: ImportFile): Promise<number>
    {
        const blueprint = this.getBluePrint(modelName);
        if (!blueprint) throw new Error();

        this.validateHeaders(file.header, blueprint.fields);

        const validated = this.validateRows(file.rows, blueprint.schema);
        const created = await blueprint.createMany(validated);

        return created.count;
    }

    getBluePrint(modelName: string): ModelBlueprint | null
    {
        return this.blueprints[modelName] ?? null;
    }

    validateHeaders(headers: string[], fields: string[]): void
    {
        const missing = fields.filter(
            field => !headers.includes(field)
        );

        const unknown = headers.filter(
            field => !fields.includes(field)
        );

        const errors: ImportError[] = [];

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

        if (errors.length > 0) {
            throw new ImportValidationError(errors);
        }
    }

    validateRows(
        rows: Record<string, unknown>[],
        schema: z.ZodTypeAny
    ): unknown[] {
        const validated: unknown[] = [];
        const errors: ImportError[] = [];

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


        if (errors.length) {
            throw new ImportValidationError(errors);
        }

        return validated;
    }
}