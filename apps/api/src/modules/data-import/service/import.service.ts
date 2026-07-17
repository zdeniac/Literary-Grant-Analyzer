import { ImportOptions, ImportRow, ImportWriter, isRelationalModelBlueprint, ModelName } from "../types/import.types";
import { ImportFile, } from "../types/import.types";
import { ImportError } from "../error/import.errors";
import { validateHeaders, validateRows } from "../validation/data-import.validation";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { RelationResolver } from "../resolver/relation-resolver";

export class ImportService
{
    constructor(
        private readonly registry: ImportBlueprintRegistry,
        private readonly writers: Record<ModelName, ImportWriter<ImportRow>>,
        private readonly relationResolver: RelationResolver,
        private readonly options: ImportOptions = {},
    ) {}

    public async import(model: ModelName, file: ImportFile): Promise<number>
    {   
        const blueprint = this.registry.getOrThrow(model);
        const writer = this.writers[model]; 

        if (!writer) throw new ImportError(`Missing import writer for ${model}`);

        validateHeaders(
            file.header, 
            blueprint.fields, 
            this.options.validation?.allowUnknownFields ?? false
        );

        if (!file.rows.length) throw new ImportError(`Missing rows for ${model}.`);

        let validatedRows = validateRows(file.rows, blueprint.schema);
        
        if (isRelationalModelBlueprint(blueprint)) {
            for (const relationBlueprint of blueprint.relations) {
                validatedRows = await this.relationResolver.resolve(
                    validatedRows,
                    relationBlueprint
                ); 
            }        
        }

        return writer.createMany(validatedRows);
    }
}