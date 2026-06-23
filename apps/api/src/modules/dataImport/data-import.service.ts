import { isRelationalBlueprint, ModelBlueprint, RelationalBlueprint } from "./types/data-import.types";
import { ImportFile } from "./types/data-import.types";
import { ImportError } from "./error/data-import.errors";
import { Repository } from "../../db/repository";
import { validateHeaders, validateRows } from "./validation/data-import.validation";

export class DataImportService {
    constructor(
        private readonly blueprints: Record<string, ModelBlueprint | RelationalBlueprint>,
        private readonly repository: Repository,
    ) {}

    public async import(modelName: string, file: ImportFile): Promise<number>
    {
        const blueprint = this.getBluePrint(modelName);
        
        if (!blueprint) throw new ImportError(`Missing blueprint for ${modelName}.`);

        validateHeaders(file.header, blueprint.fields);

        if (file.rows.length < 1) throw new ImportError(`Missing rows for ${modelName}.`);

        let validatedRows = validateRows(file.rows, blueprint.schema);
        if (isRelationalBlueprint(blueprint)) {
            validatedRows = await this.resolveRelation(validatedRows, blueprint);
        }

        return this.repository.createMany(validatedRows);;
    }

    private getBluePrint(modelName: string): ModelBlueprint | RelationalBlueprint | null
    {
        return this.blueprints[modelName] ?? null;
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
        const foreignData: Record<string, unknown>[] = 
            await this.repository.findManyBy(
                blueprint.relation.lookupField, 
                foreignTableFields
            );

        const found = new Set(
            foreignData.map(
                item => item[lookupField]
            )
        );

        const missing = foreignTableFields.filter(
            value => !found.has(value)
        );

        if (missing.length) throw new Error();

        // Rework the validated data structure by switching the sourceField and its values
        // to the foreignKey and its values
        validated.forEach((row, index) => {
            const relation = foreignData.find(
                elem => elem[lookupField] === row[sourceField]
            );

            if (!relation) throw new Error();

            delete row[sourceField];
            row[foreignKey] = relation[targetField];

        });
        
        return validated;
    }
}