import { isRelationalBlueprint, ModelBlueprint, RelationalBlueprint } from "./types/data-import.types";
import { ImportFile } from "./types/data-import.types";
import { ImportError } from "./error/data-import.errors";
import { DataImportRepository } from "../../db/types";
import { validateHeaders, validateRows } from "./validation/data-import.validation";

export class DataImportService {
    constructor(
        private readonly blueprints: Record<string, ModelBlueprint | RelationalBlueprint>,
        private readonly repositories: Record<string, DataImportRepository>,
    ) {}

    public async import(modelName: string, file: ImportFile): Promise<number>
    {
        if (!this.repositories[modelName]) throw new ImportError(`Missing repository for ${modelName}`);

        const blueprint = this.blueprints[modelName];
        
        if (!blueprint) throw new ImportError(`Missing blueprint for ${modelName}.`);

        validateHeaders(file.header, blueprint.fields);

        if (!file.rows.length) throw new ImportError(`Missing rows for ${modelName}.`);

        let validatedRows: Record<string, unknown>[] = validateRows(file.rows, blueprint.schema);
        if (isRelationalBlueprint(blueprint)) {
            validatedRows = await this.resolveRelation(validatedRows, blueprint);
        }

        return this.repositories[modelName].createMany(validatedRows);;
    }

    private async resolveRelation(
        validated: Record<string, unknown>[],
        blueprint: RelationalBlueprint
    ): Promise<Record<string, unknown>[]> {
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

        const found = new Map();

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