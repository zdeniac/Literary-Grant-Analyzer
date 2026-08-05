import { SourceDocumentDto } from "./dto/source-document.dto";
import { CreateSourceDocumentInput } from "./dto/source-document.input.dto";
import { SourceDocumentRepository } from "./source-document.repository";

export class SourceDocumentService
{
    constructor(
        private readonly repository: SourceDocumentRepository,
    ) {}

    async findOrCreateSourceDocuments(sourceDocuments: CreateSourceDocumentInput[]): Promise<SourceDocumentDto[]> 
    { 
        let repository = this.repository;

        const urls = sourceDocuments.map(document => document.url);

        this.validateUrls(urls);

        const existing = await repository.findManyByUrls(urls);

        const existingUrls = new Set(
            existing.map(document => document.url)
        );

        const missing = sourceDocuments.filter(
            document => !existingUrls.has(document.url)
        );

        if (missing.length) {
            await repository.createMany(missing);
        }

        return repository.findManyByUrls(urls);
    }

    private validateUrls(urls: string[]): void
    {
        const duplicateUrls = urls.filter(
            (url, index) => urls.indexOf(url) !== index
        );

        if (duplicateUrls.length) {
            throw new Error(
                `Duplicate source document URLs: ${duplicateUrls.join(', ')}`
            );
        }
    }
}