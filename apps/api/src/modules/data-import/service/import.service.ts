import { isRelationalBlueprint } from "../types/import.types";
import { ImportFile } from "../types/import.types";
import { ImportError } from "../error/import.errors";
import { ImportTargetRepository } from "../../../db/types";
import { validateHeaders, validateRows } from "../validation/data-import.validation";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { RelationResolver } from "../resolver/relation.resolver";

export class ImportService {
    constructor(
        private readonly registry: ImportBlueprintRegistry,
        private readonly repositories: Record<string, ImportTargetRepository>,
        private readonly relationResolver: RelationResolver
    ) {}

    public async import(model: string, file: ImportFile): Promise<number>
    {
        const blueprint = this.registry.getOrThrow(model);
        const repository = this.repositories[model];

        if (!repository) throw new ImportError(`Missing repository for ${model}`);

        validateHeaders(file.header, blueprint.fields);

        if (!file.rows.length) throw new ImportError(`Missing rows for ${model}.`);

        let validatedRows = validateRows(file.rows, blueprint.schema);
        if (isRelationalBlueprint(blueprint)) {
            validatedRows = await this.relationResolver.resolve(validatedRows, blueprint);
        }

        return repository.createMany(validatedRows);;
    }
}