import { ImportError, ImportRelationError } from "../error/import.errors";
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
        const foreignTableValues = validated.map(row => row[sourceField]);

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

        const missing = foreignTableValues.filter(
            (value) => !found.has(value)
        );

        if (missing.length) {
            throw new ImportRelationError(missing as string[]);
        }

        // We rework the validated data structure by switching the source and its values
        // to the foreign data and its values
        // e.g. the imported row's organizationName = 'something'
        // will be changed to organizationId = number
        validated.forEach((row) => {
            const relation = found.get(row[sourceField])!;

            delete row[sourceField];
            row[relationBlueprint.foreignKey] = relation[relationBlueprint.targetField];
        });
    
        return validated;
    }
}
