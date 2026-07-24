import { ImportOptions, ImportRow, ImportWriterInterface, ModelName } from "../types/import.types";
import { ImportFile, } from "../types/import.types";
import { ImportError, ImportRelationError, ImportValidationError } from "../error/import.errors";
import { validateHeaders, validateRows } from "../validation/data-import.validation";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { RelationResolver } from "../resolver/relation-resolver";
import { isRelationalModelBlueprint } from "../types/guards.types";
import { ImportJobRepository } from "../repository/import-job.repository";

export class ImportService
{
    constructor(
        private readonly importJobRepository: ImportJobRepository,
        private readonly registry: ImportBlueprintRegistry,
        private readonly writers: Record<ModelName, ImportWriterInterface<ImportRow>>,
        private readonly relationResolver: RelationResolver,
        private readonly options: ImportOptions = {},
    ) {}

    // @todo source document id-t besettelni ImportContext?
    public async import(model: ModelName, file: ImportFile): Promise<number>
    {
        const job = await this.importJobRepository.create({
            model,
            mimeType: file.mimeType,
            fileName: file.fileName,
        });

        try {
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

            const total = await writer.createMany(validatedRows);

            await this.importJobRepository.complete(job.id, total);

            return total;
        } catch(error) {
            if (error instanceof ImportValidationError) {
                await this.importJobRepository.fail(job.id, {
                    errorMessage: error.message,
                    failedRows: error.errors.length
                });
            }
            else if (error instanceof ImportRelationError) {
                await this.importJobRepository.fail(job.id, {
                    errorMessage: error.message,
                    failedRows: file.rows.length
                });
            }
            else {
                await this.importJobRepository.fail(job.id, {
                    errorMessage: error instanceof Error
                        ? error.message
                        : String(error),
                });
            }

            throw error;        
        }
    }
}