import { ImportTargetRepository } from "../../../db/types";
import { ImportError } from "../error/import.errors";
import { ImportRow, ModelName, RelationBlueprint } from "../types/import.types";

export class RelationResolver {
    constructor(
        private readonly repositories: Record<ModelName, ImportTargetRepository>,
    ) {}

    public async resolve(validated: ImportRow[], blueprint: RelationBlueprint): Promise<ImportRow[]> 
    {
        const model = blueprint.model;

        const sourceField = blueprint.sourceField;
        const targetField = blueprint.targetField;

        const foreignKey = blueprint.foreignKey;
        const lookupField = blueprint.lookupField;

        // Get the foreign data by the given field's values
        const foreignTableValues = validated.map(row => row[sourceField]);

        // Check if they are in the db
        const foreignData: Record<string, unknown>[] = 
            await this.repositories[model].findManyBy(
                lookupField,
                foreignTableValues
            );

        const found = new Map<unknown, Record<string, unknown>>();

        for (const item of foreignData) {
            found.set(item[lookupField], item);
        }

        const missing = foreignTableValues.filter(
            value => !found.has(value)
        );

        if (missing.length) throw new ImportError(`Missing foreign record with data: ${missing.join(', ')}`);

        // We rework the validated data structure by switching the source and its values
        // to the foreign data and its values
        validated.forEach((row) => {
            const relation = found.get(row[sourceField])!;

            delete row[sourceField];
            row[foreignKey] = relation[targetField];
        });
        
        return validated;
    }
}
