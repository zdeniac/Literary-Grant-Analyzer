import { ImportValidationError } from "../error/import.errors";
import { ImportLookupInterface, ImportRow, ImportRowError, ModelName, RelationBlueprint } from "../types/import.types";

export class RelationResolver
{
    constructor(
        private readonly lookups: Record<ModelName, ImportLookupInterface<any>>,
    ) {}

    public async resolve(rows: ImportRow[], relationBlueprint: RelationBlueprint): Promise<ImportRow[]> 
    {
        const sourceField = relationBlueprint.sourceField;
        const lookupField = relationBlueprint.lookupField;

        // Get the foreign data by the given field's values, e.g. 'organizationName'
        const foreignTableValues = relationBlueprint.multiple
            ? rows.flatMap(row => row[sourceField] as unknown[])
            : rows.map(row => row[sourceField]);

        // Check if they are in the db by the lookup field, e.g. 'name' (in organizations)
        const foreignData: Record<string, unknown>[] = 
            await this.lookups[relationBlueprint.model].findManyBy(
                lookupField,
                foreignTableValues
            );

        const found = new Map<unknown, Record<string, unknown>>();

        for (const item of foreignData) {
            found.set(item[lookupField], item);
        }

        this.validateRelations(rows, relationBlueprint, found);

        return this.transformRows(rows, relationBlueprint, found);
    }

    private validateRelations(
        rows: ImportRow[],
        relation: RelationBlueprint,
        found: Map<unknown, Record<string, unknown>>,
    ): void {
        const missing: ImportRowError[] = [];

        rows.forEach((row, rowIndex) => {
            const values = relation.multiple
                ? (row[relation.sourceField] as unknown[])
                : [row[relation.sourceField]];

            const issues = values
                .filter(value => !found.has(value))
                .map(value => ({
                    field: relation.sourceField,
                    value,
                    message: `Unknown ${relation.sourceField}: ${String(value)}`,
                }));

            if (issues.length) {
                missing.push({
                    row: rowIndex + 2,
                    issues,
                });
            }
        });

        if (missing.length) {
            throw new ImportValidationError(
                missing,
                'IMPORT_RELATION_ERROR',
            );
        }
    }

    private transformRows(
        rows: ImportRow[], 
        relation: RelationBlueprint, 
        found: Map<unknown, Record<string, unknown>>,
    ): ImportRow[] {
        const {
            sourceField,
            foreignKey,
            targetField,
            multiple,
        } = relation;

        // We rework the validated data structure by switching the source and its values
        // to the foreign data and its values
        // e.g. the imported row's organizationName = 'something'
        // will be changed to organizationId = number
        return rows.map(row => {
            const transformedRow = { ...row };

            if (multiple) {
                transformedRow[foreignKey] = (row[sourceField] as unknown[])
                        .map(value => {
                            const relatedRecord = found.get(value)!;

                            return relatedRecord[targetField];
                        });
            } else {
                const relatedRecord = found.get(row[sourceField])!;

                transformedRow[foreignKey] = relatedRecord[targetField];
            }

            delete transformedRow[sourceField];

            return transformedRow;
        });
    }
}
