import { ImportFile, ImportOptions, ImportRow, ImportWriterInterface, EntityName, RelationalEntityBlueprint, RelationResolverRegistry } from "../types/import.types";
import { ImportEmptyFileError, ImportError, ImportValidationError } from "../error/import.errors";
import { validateHeaders, validateRows } from "../validation/data-import.validation";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { isCompositeRelationBlueprint, isRelationalEntityBlueprint } from "../types/guards.types";
import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobEntity } from "../dto/import-job.dto";
import { ImportableEntityName } from "../constants/importable-models";
import { ImportWriterRegistry } from "../registry/import-writer.registry";

export class ImportService
{
    constructor(
        private readonly importJobRepository: ImportJobRepository,
        private readonly registry: ImportBlueprintRegistry,
        private readonly writers: ImportWriterRegistry,
        private readonly relationResolvers: RelationResolverRegistry,
        private readonly options: ImportOptions = {},
    ) {}

    public async import(entity: ImportableEntityName, file: ImportFile): Promise<ImportJobEntity> 
    {
        const job = await this.importJobRepository.create({
            model: entity,
            mimeType: file.mimeType,
            fileName: file.fileName,
            totalRows: file.rows.length,
        })

        try {
            const blueprint = this.registry.getOrThrow(entity);
            const writer = this.writers.getOrThrow(entity); 

            if (!writer) throw new ImportError(`Missing import writer for ${entity}`);
            
            validateHeaders(
                file.header, 
                blueprint.fields, 
                this.options.validation?.allowUnknownFields ?? false
            );

            if (!file.rows.length) throw new ImportEmptyFileError(`Missing rows for ${entity}.`);

            let validatedRows = validateRows(file.rows, blueprint.schema);

            if (isRelationalEntityBlueprint(blueprint)) {
                validatedRows = await this.resolveRelations(validatedRows, blueprint);
            }

            const total = await writer.createMany(validatedRows);
            const importJob = await this.importJobRepository.complete(job.id, total);

            return importJob;
        } catch(error) {
            if (error instanceof ImportValidationError) {
                await this.importJobRepository.fail(job.id, {
                    errorMessage: error.message,
                    failedRows: error.errors.length
                });
            } else {
                await this.importJobRepository.fail(job.id, {
                    errorMessage: error instanceof Error
                        ? error.message
                        : String(error),
                });
            }

            throw error;        
        }
    }

    private async resolveRelations(rows: ImportRow[], blueprint: RelationalEntityBlueprint): Promise<ImportRow[]> 
    {
        for (const relation of blueprint.relations) {
            if (isCompositeRelationBlueprint(relation)) {
                rows = await this.relationResolvers.composite.resolve(rows, relation);
                continue;
            }

            if (!this.relationResolvers.simple) {
                throw new ImportError(`Missing relation resolver for ${relation} relations.`);
            }

            rows = await this.relationResolvers.simple.resolve(rows, relation);
        }

        return rows;
    }
}