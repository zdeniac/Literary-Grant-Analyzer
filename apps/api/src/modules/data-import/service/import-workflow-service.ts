import { ImportJobSourceDocumentService } from "../../import-job-source-document/import-job-source-document.service";
import { SourceDocumentDto } from "../../source-document/dto/source-document.dto";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { SourceDocumentService } from "../../source-document/source-document.service";
import { ImportableEntityName } from "../constants/importable-models";
import { ImportJobEntity } from "../dto/import-job.dto";
import { ImportFile } from "../types/import.types";
import { ImportService } from "./import.service";

export class ImportWorkflowService
{
    constructor(
        private readonly importService: ImportService,
        private readonly sourceDocumentService: SourceDocumentService,
        private readonly importJobSourceDocumentService: ImportJobSourceDocumentService,
    ) {}

    async import(
        entity: ImportableEntityName,
        file: ImportFile,
        sourceDocumentsInput: CreateSourceDocumentInput[] = []
    ): Promise<ImportJobEntity> {
        let sourceDocuments: SourceDocumentDto[] = [];

        // The source documents are always saved if true, even if the import itself fails.
        if (sourceDocumentsInput.length) {
            sourceDocuments = await this.sourceDocumentService.findOrCreateSourceDocuments(
                sourceDocumentsInput
            );
        }

        const importJob = await this.importService.import(entity, file);

        if (sourceDocuments.length) {
            await this.importJobSourceDocumentService.linkImportJobToSourceDocuments(
                importJob.id,
                sourceDocuments
            );
        }

        return importJob;
    }
}