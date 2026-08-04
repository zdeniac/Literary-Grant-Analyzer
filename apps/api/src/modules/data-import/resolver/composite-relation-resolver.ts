import { ImportRelationError } from "../error/import.errors";
import { CompositeLookup, CompositeRelationBlueprint, ImportLookupInterface, ImportRow, ImportRowError, ModelName, RelationResolverInterface } from "../types/import.types";

export class CompositeRelationResolver implements RelationResolverInterface<CompositeRelationBlueprint>
{
    constructor(
        private readonly lookups: Record<ModelName, ImportLookupInterface<any>>
    ) {}

    public async resolve(rows: ImportRow[], relationBlueprint: CompositeRelationBlueprint): Promise<ImportRow[]>
    {
        if (!rows.length) {
            return [];
        }

        const nestedLookups = relationBlueprint.lookup.filter(
            lookup => typeof lookup.foreignModel !== 'undefined' && typeof lookup.foreignKey !== 'undefined'
        );

        let workingRows = rows.map(row => ({ ...row }));

        if (nestedLookups.length) {
            workingRows = await this.resolveNestedLookups(workingRows, nestedLookups);
        }

        return await this.resolveTargetRelation(workingRows, relationBlueprint);
    }

    private async resolveNestedLookups(rows: ImportRow[], lookups: CompositeLookup): Promise<ImportRow[]>
    {
        let workingRows = rows.map(row => ({ ...row }));

        for (const lookup of lookups) {
            const sourceField = lookup.sourceField;
            const lookupField = lookup.lookupField;
            const foreignKey = lookup.foreignKey!;
            const model = lookup.foreignModel!;

            const values = workingRows.map(row => row[sourceField]);
            const foreignData = await this.lookups[model].findManyBy(lookupField, values);

            const found = new Map<unknown, Record<string, unknown>>();
            const duplicatedKeys = new Set<unknown>();

            for (const item of foreignData) {
                const key = item[lookupField];
                if (found.has(key)) {
                    duplicatedKeys.add(key);
                } else {
                    found.set(key, item);
                }
            }

            if (duplicatedKeys.size > 0) {
                const issues: ImportRowError[] = [];

                workingRows.forEach((row, rowIndex) => {
                    const value = row[sourceField];

                    if (duplicatedKeys.has(value)) {
                        issues.push({
                            row: rowIndex + 2,
                            issues: [{
                                field: sourceField,
                                value,
                                message: `Multiple ${model} records found for ${sourceField}: ${String(value)}.`,
                            }],
                        });
                    }
                });

                if (issues.length) {
                    throw new ImportRelationError(issues);
                }
            }

            const missing: ImportRowError[] = [];

            workingRows.forEach((row, rowIndex) => {
                const value = row[sourceField];

                if (!found.has(value)) {
                    missing.push({
                        row: rowIndex + 2,
                        issues: [{
                            field: sourceField,
                            value,
                            message: `No ${sourceField} with value "${String(value)}" found in the database.`,
                        }],
                    });
                }
            });

            if (missing.length) {
                throw new ImportRelationError(missing);
            }

            workingRows = workingRows.map(row => {
                const relatedRecord = found.get(row[sourceField])!;
                return {
                    ...row,
                    [foreignKey]: relatedRecord.id,
                };
            });
        }

        return workingRows;
    }

    private async resolveTargetRelation(
        rows: ImportRow[], 
        relationBlueprint: CompositeRelationBlueprint
    ): Promise<ImportRow[]> {
        const model: ModelName = relationBlueprint.model;

        const directLookups = relationBlueprint.lookup.filter(lookup => typeof lookup.foreignModel === 'undefined');

        const nestedKeyLookups = relationBlueprint.lookup
            .filter(lookup => typeof lookup.foreignModel !== 'undefined' && typeof lookup.foreignKey !== 'undefined')
            .map(lookup => ({
                sourceField: lookup.foreignKey!,
                lookupField: lookup.foreignKey!,
            }));

        const criteria = [
            ...directLookups.map(lookup => ({
                sourceField: lookup.sourceField,
                lookupField: lookup.lookupField,
            })),
            ...nestedKeyLookups,
        ];

        if (!criteria.length) {
            throw new ImportRelationError([
                {
                    row: 0,
                    issues: [{
                        message: 'Composite relation requires at least one lookup criterion.',
                    }],
                },
            ]);
        }

        const foreignData = await this.collectForeignData(model, criteria, rows);
        return this.applyRelation(rows, relationBlueprint, foreignData, criteria);
    }

    private async collectForeignData(
        model: ModelName, 
        criteria: Array<{ sourceField: string; lookupField: string; }>, 
        rows: ImportRow[]
    ): Promise<Record<string, unknown>[]> {
        const foreignData: Record<string, unknown>[] = [];

        for (const criterion of criteria) {
            const values = rows.map(row => row[criterion.sourceField]);
            const data = await this.lookups[model].findManyBy(criterion.lookupField, values);
            
            foreignData.push(...data.map(item => ({ ...item })));
        }

        const unique = new Map<string, Record<string, unknown>>();

        for (const item of foreignData) {
            unique.set(JSON.stringify(item), item);
        }

        return Array.from(unique.values());
    }

    private applyRelation(
        rows: ImportRow[], 
        relationBlueprint: CompositeRelationBlueprint, 
        foreignData: Record<string, unknown>[],
        criteria: Array<{ sourceField: string; lookupField: string; }>
    ): ImportRow[] {
        const missing: ImportRowError[] = [];

        const transformedRows = rows.map((row, rowIndex) => {
            const matches = foreignData.filter(item =>
                criteria.every(({ sourceField, lookupField }) => item[lookupField] === row[sourceField])
            );

            if (matches.length !== 1) {
                missing.push({
                    row: rowIndex + 2,
                    issues: [{
                        field: relationBlueprint.foreignKey,
                        value: criteria.map(({ sourceField }) => row[sourceField]),
                        message: matches.length === 0
                            ? `No ${Array.isArray(relationBlueprint.model) 
                                ? relationBlueprint.model.join(', ') 
                                : relationBlueprint.model} record found for the composite lookup.`
                            : `Multiple ${Array.isArray(relationBlueprint.model) 
                                ? relationBlueprint.model.join(', ') 
                                : relationBlueprint.model} records match the composite lookup.`,
                    }],
                });

                return { ...row };
            }

            const relatedRecord = matches[0];
            const transformedRow: ImportRow = {
                ...row,
                [relationBlueprint.foreignKey]: relatedRecord[relationBlueprint.targetField],
            };

            const cleanupFields = new Set<string>(relationBlueprint.lookup.map(lookup => lookup.sourceField));
            relationBlueprint.lookup
                .filter(lookup => typeof lookup.foreignModel !== 'undefined' && typeof lookup.foreignKey !== 'undefined')
                .forEach(lookup => cleanupFields.add(lookup.foreignKey!));
            cleanupFields.delete(relationBlueprint.foreignKey);

            cleanupFields.forEach(field => {
                delete transformedRow[field];
            });

            return transformedRow;
        });

        if (missing.length) {
            throw new ImportRelationError(missing);
        }

        return transformedRows;
    }
}
