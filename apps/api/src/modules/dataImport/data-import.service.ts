import { isRelationalBlueprint, ModelBlueprint, RelationalBlueprint } from "./types/data-import.types";
import { ImportFile } from "./types/data-import.types";
import { ImportError } from "./error/data-import.errors";
import { Repository } from "../../db/types";
import { validateHeaders, validateRows } from "./validation/data-import.validation";
// @todo: a beágyazott ciklusokat refaktorálni és hatékonyabbá tenni
export class DataImportService {
    constructor(
        private readonly blueprints: Record<string, ModelBlueprint | RelationalBlueprint>,
        private readonly repositories: Record<string, Repository>,
    ) {}

    public async import(modelName: string, file: ImportFile): Promise<number>
    {
        if (!this.repositories[modelName]) throw new ImportError(`Missing repository for ${modelName}`);

        const blueprint = this.getBluePrint(modelName);
        
        if (!blueprint) throw new ImportError(`Missing blueprint for ${modelName}.`);

        validateHeaders(file.header, blueprint.fields);

        if (file.rows.length < 1) throw new ImportError(`Missing rows for ${modelName}.`);

        let validatedRows = validateRows(file.rows, blueprint.schema);
        if (isRelationalBlueprint(blueprint)) {
            validatedRows = await this.resolveRelation(validatedRows, blueprint);
        }

        return this.repositories[modelName].createMany(validatedRows);;
    }

    private getBluePrint(modelName: string): ModelBlueprint | RelationalBlueprint | null
    {
        return this.blueprints[modelName] ?? null;
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
        const foreignTableData = validated.map(row => row[sourceField]);

        // Check if they are in the db
        const foreignData: Record<string, unknown>[] = 
            await this.repositories[repository].findManyBy(
                blueprint.relation.lookupField, 
                foreignTableData
            );

        const found = new Set(
            foreignData.map(
                item => item[lookupField]
            )
        );

        const missing = foreignTableData.filter(
            value => !found.has(value)
        );

        if (missing.length) throw new Error(`Missing foreign record with data: ${missing.join(', ')}`);

        // Rework the validated data structure by switching the sourceField and its values
        // to the foreignKey and its values
        validated.forEach((row, index) => {
            const relation = foreignData.find(
                elem => elem[lookupField] === row[sourceField]
            );

            if (!relation) throw new Error(`Missing relation.`);

            delete row[sourceField];
            row[foreignKey] = relation[targetField];

        });
        
        return validated;
    }
}