import { Id } from "../../common/types/types";
import { SourceDocumentDto } from "../source-document/dto/source-document.dto";
import { ImportJobSourceDocumentRepository } from "./import-job-source-document.repository";

export class ImportJobSourceDocumentService
{
    constructor(
        private readonly repository: ImportJobSourceDocumentRepository
    ) {}

    async linkImportJobToSourceDocuments(importJobId: Id, sourceDocuments: SourceDocumentDto[]): Promise<number>
    {
        const data = sourceDocuments.map(document => ({
            importJobId,
            sourceDocumentId: document.id
        }));

        return this.repository.createMany(data);
    }
}