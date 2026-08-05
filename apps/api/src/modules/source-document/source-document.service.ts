import { SourceDocumentEntity } from "./dto/source-document.dto";
import { CreateSourceDocumentInput } from "./dto/source-document.input.dto";
import { SourceDocumentRepository } from "./source-document.repository";

export class SourceDocumentService
{
    constructor(
        private readonly repository: SourceDocumentRepository<SourceDocumentEntity, CreateSourceDocumentInput>,
    ) {}

    async findOrCreateSourceDocuments(sourceDocuments: CreateSourceDocumentInput[]): Promise<SourceDocumentEntity[]> 
    { 
        const urls = sourceDocuments.map(document => document.url);

        this.validateUrls(urls);

        const existing = await this.repository.findManyByUrls(urls);

        const existingUrls = new Set(
            existing.map(document => document.url)
        );

        const missing = sourceDocuments.filter(
            document => !existingUrls.has(document.url)
        );

        if (missing.length) {
            await this.repository.createMany(missing);
        }

        return this.repository.findManyByUrls(urls);
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