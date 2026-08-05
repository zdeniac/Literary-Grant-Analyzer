import { Database } from "../../../db/types";
import { ImportJobSourceDocumentService } from "../../import-job-source-document/import-job-source-document.service";
import { SourceDocumentDto } from "../../source-document/dto/source-document.dto";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { SourceDocumentService } from "../../source-document/source-document.service";
import { ImportJobDto } from "../dto/import-job.dto";
import { ImportFile, ModelName } from "../types/import.types";
import { ImportService } from "./import.service";

export class ImportWorkflowService
{
    constructor(
        private readonly db: Database,
        private readonly importService: ImportService,
        private readonly sourceDocumentService: SourceDocumentService,
        private readonly importJobSourceDocumentService: ImportJobSourceDocumentService,
    ) {}

    async import(
        model: ModelName,
        file: ImportFile,
        sourceDocumentsInput: CreateSourceDocumentInput[] = []
    ): Promise<ImportJobDto> {
        let sourceDocuments: SourceDocumentDto[] = [];


        // The source documents are always saved if true
        // even if the import itself fails.
        // The source documents are domain level entities.
        if (sourceDocumentsInput.length) {
            sourceDocuments = await this.sourceDocumentService.findOrCreateSourceDocuments(
                sourceDocumentsInput
            );
        }

        const importJob = await this.importService.import(model, file);

        if (sourceDocuments.length) {
            await this.importJobSourceDocumentService.linkImportJobToSourceDocuments(
                importJob.id,
                sourceDocuments
            );
        }

        return importJob;
    }
}