import { ImportTargetRepository } from "../../../db/types";
import { ImportError } from "../error/import.errors";
import { RelationalBlueprint } from "../types/import.types";

export class RelationResolver {
    constructor(
        private readonly repositories: Record<string, ImportTargetRepository>,
    ) {}

    public async resolve(
        validated: Record<string, unknown>[],
        blueprint: RelationalBlueprint,
    ): Promise<Record<string, unknown>[]> 
    {
        const repository = blueprint.relation.repository;

        const sourceField = blueprint.relation.sourceField;
        const targetField = blueprint.relation.targetField;

        const foreignKey = blueprint.relation.foreignKey;
        const lookupField = blueprint.relation.lookupField;

        // Get the foreign data by the given field's values
        const foreignTableValues = validated.map(row => row[sourceField]);

        // Check if they are in the db
        const foreignData: Record<string, unknown>[] = 
            await this.repositories[repository].findManyBy(
                lookupField,
                foreignTableValues
            );

        const found = new Map<unknown, Record<string, unknown>>();

        foreignData.map(
            item => found.set(item[lookupField], item)
        );

        const missing = foreignTableValues.filter(
            value => !found.has(value)
        );

        if (missing.length) throw new ImportError(`Missing foreign record with data: ${missing.join(', ')}`);

        // Rework the validated data structure by switching the sourceField and its values
        // to the foreignKey and its values
        validated.forEach((row) => {
            const relation = found.get(row[sourceField]);

            if (!relation) throw new ImportError(`Missing relation for source field ${sourceField}.`);

            delete row[sourceField];
            row[foreignKey] = relation[targetField];
        });
        
        return validated;
    }
}
