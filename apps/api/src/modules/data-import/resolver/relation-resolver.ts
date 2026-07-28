import { ImportRelationError, ImportRowError } from "../error/import.errors";
import { ImportLookupInterface, ImportRow, ModelName, RelationBlueprint } from "../types/import.types";

export class RelationResolver
{
    constructor(
        private readonly lookups: Record<ModelName, ImportLookupInterface<any>>,
    ) {}

    public async resolve(validated: ImportRow[], relationBlueprint: RelationBlueprint): Promise<ImportRow[]> 
    {
        const model = relationBlueprint.model;

        const sourceField = relationBlueprint.sourceField;
        const lookupField = relationBlueprint.lookupField;

        // Get the foreign data by the given field's values, e.g. 'organizationName'
        const foreignTableValues = relationBlueprint.multiple
            ? validated.flatMap(row => row[sourceField] as unknown[])
            : validated.map(row => row[sourceField]);

        // Check if they are in the db by the lookup field, e.g. 'name' (in organizations)
        const foreignData: Record<string, unknown>[] = 
            await this.lookups[model].findManyBy(
                lookupField,
                foreignTableValues
            );

        const found = new Map<unknown, Record<string, unknown>>();

        for (const item of foreignData) {
            found.set(item[lookupField], item);
        }

        const missing: ImportRowError[] = [];

        foreignTableValues.forEach((value, index) => {
            if (!found.has(value)) {
                missing.push({
                    row: index + 2,
                    issues: [
                        {
                            message: `Unknown ${sourceField}: ${String(value)}`,
                        },
                    ],
                });
            }
        });

        if (missing.length) {
            throw new ImportRelationError(missing);
        }

        const foreignKey = relationBlueprint.foreignKey;
        const targetField = relationBlueprint.targetField;

        // We rework the validated data structure by switching the source and its values
        // to the foreign data and its values
        // e.g. the imported row's organizationName = 'something'
        // will be changed to organizationId = number
        return validated.map(row => {
            const transformedRow = { ...row };

            if (relationBlueprint.multiple) {
                transformedRow[relationBlueprint.foreignKey] = (row[sourceField] as unknown[])
                        .map(value => {
                            const relatedRecord = found.get(value)!;

                            return relatedRecord[relationBlueprint.targetField];
                        });
            } else {
                const relatedRecord = found.get(row[sourceField])!;

                transformedRow[relationBlueprint.foreignKey] = relatedRecord[relationBlueprint.targetField];
            }

            delete transformedRow[sourceField];

            return transformedRow;
        });
    }
}
