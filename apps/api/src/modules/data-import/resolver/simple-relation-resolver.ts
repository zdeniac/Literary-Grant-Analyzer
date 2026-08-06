import { ImportRelationError } from "../error/import.errors";
import { ImportLookupRegistry } from "../registry/import-lookup.registry";
import { ImportFileRowError } from "../types/error.types";
import { SimpleImportLookup, SimpleRelationImportBlueprint } from "../types/import-blueprint.types";
import { ImportRow, RelationResolverInterface } from "../types/import.types";

export class SimpleRelationResolver implements RelationResolverInterface<SimpleRelationImportBlueprint>
{
    constructor(
        private readonly lookupRegistry: ImportLookupRegistry,
    ) {}

    public async resolve(rows: ImportRow[], relationBlueprint: SimpleRelationImportBlueprint): Promise<ImportRow[]> 
    {
        const lookup: SimpleImportLookup = relationBlueprint.lookup;

        const sourceField = lookup.sourceField;
        const lookupField = lookup.lookupField;
        const entities = Array.isArray(relationBlueprint.entity)
            ? relationBlueprint.entity
            : [relationBlueprint.entity];

        // Get the foreign data by the given field's values, e.g. 'organizationName'
        const foreignTableValues = relationBlueprint.multiple
            ? rows.flatMap(row => row[sourceField] as unknown[])
            : rows.map(row => row[sourceField]);

        let foreignData: Record<string, unknown>[] = [];

        for (const entity of entities) {
            // Check if they are in the db by the lookup field, e.g. 'name' (in organizations)
            const data = await this.lookupRegistry.getOrThrow(entity).findManyBy(
                lookupField,
                foreignTableValues
            );
            
            foreignData.push(...data);
        }

        const found = new Map<unknown, Record<string, unknown>>();

        for (const item of foreignData) {
            found.set(item[lookupField], item);
        }

        this.validateRelations(rows, lookup, found, relationBlueprint?.multiple ?? false);

        return this.transformRows(rows, relationBlueprint, found);
    }

    private validateRelations(
        rows: ImportRow[],
        lookup: SimpleImportLookup,
        found: Map<unknown, Record<string, unknown>>,
        multiple: boolean,
    ): void {
        const missing: ImportFileRowError[] = [];

        rows.forEach((row, rowIndex) => {
            const values = multiple
                ? (row[lookup.sourceField] as unknown[])
                : [row[lookup.sourceField]];

            const issues = values
                .filter(value => !found.has(value))
                .map(value => ({
                    field: lookup.sourceField,
                    value,
                    message: `No ${lookup.sourceField} with value "${String(value)}" found in the database.`,
                }));

            if (issues.length) {
                missing.push({
                    rowNum: rowIndex + 2,
                    issues,
                });
            }
        });

        if (missing.length) {
            throw new ImportRelationError(missing);
        }
    }

    private transformRows(
        rows: ImportRow[], 
        relation: SimpleRelationImportBlueprint, 
        found: Map<unknown, Record<string, unknown>>,
    ): ImportRow[] {
        const {
            lookup: { sourceField },
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
