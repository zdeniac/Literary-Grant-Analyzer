import { ImportFile, ImportOptions, ImportRow, ImportWriterInterface, ModelName, RelationalModelBlueprint, RelationResolverRegistry } from "../types/import.types";
import { ImportEmptyFileError, ImportError, ImportValidationError } from "../error/import.errors";
import { validateHeaders, validateRows } from "../validation/data-import.validation";
import { ImportBlueprintRegistry } from "../registry/import-blueprint.registry";
import { isCompositeRelationBlueprint, isRelationalModelBlueprint } from "../types/guards.types";
import { ImportJobRepository } from "../repository/import-job.repository";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { EventDispatcher } from "../../../common/events/event-dispatcher";
import { ImportCompletedWithSourceDocumentsEvent } from "../event/import-completed-with-documents.event";

export class ImportService
{
    constructor(
        private readonly importJobRepository: ImportJobRepository,
        private readonly eventDispatcher: EventDispatcher,
        private readonly registry: ImportBlueprintRegistry,
        private readonly writers: Record<ModelName, ImportWriterInterface<ImportRow>>,
        private readonly relationResolvers: RelationResolverRegistry,
        private readonly options: ImportOptions = {},
    ) {}

    public async import(
        model: ModelName, 
        file: ImportFile, 
        sourceDocuments?: CreateSourceDocumentInput[]
    ): Promise<number> {
        const job = await this.importJobRepository.create({
            model,
            mimeType: file.mimeType,
            fileName: file.fileName,
            totalRows: file.rows.length,
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

            if (!file.rows.length) throw new ImportEmptyFileError(`Missing rows for ${model}.`);

            let validatedRows = validateRows(file.rows, blueprint.schema);

            if (isRelationalModelBlueprint(blueprint)) {
                validatedRows = await this.resolveRelations(validatedRows, blueprint);
            }

            const total = await writer.createMany(validatedRows);

            const importJob = await this.importJobRepository.complete(job.id, total);

            if (sourceDocuments?.length && total > 0) {
                this.eventDispatcher.dispatch(
                    new ImportCompletedWithSourceDocumentsEvent(
                        importJob.id,
                        total,
                        sourceDocuments
                    )
                );
            }

            return total;
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

    private async resolveRelations(rows: ImportRow[], blueprint: RelationalModelBlueprint): Promise<ImportRow[]> 
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