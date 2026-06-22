import z from "zod";
import { isRelationalBlueprint, ModelBlueprint, RelationalBlueprint } from "./data-import.blueprints";
import { ImportFile } from "./data-import.types";
import { ImportValidationError, ImportError, ImportRowError } from "./data-import.errors";

export class DataImportService {
    constructor(
        private readonly blueprints: Record<string, ModelBlueprint | RelationalBlueprint>
    ) {}

    public async import(modelName: string, file: ImportFile): Promise<number>
    {
        const blueprint = this.getBluePrint(modelName);
        
        if (!blueprint) {
            throw new ImportError(`Missing blueprint for ${modelName}.`);
        }

        this.validateHeaders(file.header, blueprint.fields);

        if (file.rows.length < 1) {
            throw new ImportError(`Missing rows for ${modelName}.`);
        }

        let validatedRows = this.validateRows(file.rows, blueprint.schema);

        if (isRelationalBlueprint(blueprint)) {
            validatedRows = await this.resolveRelation(validatedRows, blueprint);
        }

        const created = await blueprint.createMany(validatedRows);

        return created.count;
    }

    private getBluePrint(modelName: string): ModelBlueprint | RelationalBlueprint | null
    {
        return this.blueprints[modelName] ?? null;
    }

    private validateHeaders(headers: string[], fields: string[]): void
    {
        const missing = fields.filter(
            field => !headers.includes(field)
        );

        const unknown = headers.filter(
            field => !fields.includes(field)
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

        if (errors.length > 0) {
            throw new ImportValidationError(errors);
        }
    }

    private validateRows(
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

        if (errors.length) {
            throw new ImportValidationError(errors);
        }

        return validated;
    }

    private async resolveRelation(
        validated: Record<string, unknown>[],
        blueprint: RelationalBlueprint
    ): Promise<Record<string, unknown>[]> {
        const sourceField = blueprint.relation.sourceField;
        const targetField = blueprint.relation.targetField;
        const foreignKey = blueprint.relation.foreignKey;
        const lookupField = blueprint.relation.lookupField;

        // Get the foreign data by the given field's values
        const foreignTableFields = validated.map(row => row[sourceField]);

        // Check if they are in the db
        const foreignData: Record<string, unknown>[] = await blueprint.checkRelation(foreignTableFields as string[]);

        const found = new Set(
            foreignData.map(
                item => item[lookupField]
            )
        );

        const missing = foreignTableFields.filter(
            value => !found.has(value)
        );

        if (missing.length) {
            throw new Error();
        }

        // Rework the validated data structure by switching the sourceField and its values
        // to the foreignKey and its values
        validated.forEach((row, index) => {
            const relation = foreignData.find(
                elem => elem[lookupField] === row[sourceField]
            );

            if (!relation) {
                throw new Error();
            }

            delete row[sourceField];
            row[foreignKey] = relation[targetField];

        });
        
        return validated;
    }
}