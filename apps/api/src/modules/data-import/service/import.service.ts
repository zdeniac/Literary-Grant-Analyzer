import { ImportWriter, isRelationalModelBlueprint } from "../types/import.types";
import { ImportFile, ImportRow } from "../types/import.types";
import { ImportError } from "../error/import.errors";
import { validateHeaders, validateRows } from "../validation/data-import.validation";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { RelationResolver } from "../resolver/relation-resolver";

export class ImportService
{
    constructor(
        private readonly registry: ImportBlueprintRegistry,
        private readonly writers: Record<string, ImportWriter>,
        private readonly relationResolver: RelationResolver
    ) {}

    public async import(model: string, file: ImportFile): Promise<number>
    {   
        const blueprint = this.registry.getOrThrow(model);
        const writer = this.writers[model]; 

        if (!writer) throw new ImportError(`Missing import writer for ${model}`);

        validateHeaders(file.header, blueprint.fields);

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