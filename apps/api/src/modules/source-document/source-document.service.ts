import { Id, ListQueryParams } from "../../common/types/types";
import { SourceDocumentEntity } from "./dto/source-document.dto";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "./dto/source-document.input.dto";
import { SourceDocumentRepository } from "./source-document.repository";

export class SourceDocumentService
{
    constructor(
        private readonly repository: SourceDocumentRepository,
    ) {}

    async create(data: CreateSourceDocumentInput): Promise<SourceDocumentEntity>
    {
        return this.repository.create(data);
    }

    async update(id: Id, data: UpdateSourceDocumentInput): Promise<SourceDocumentEntity>
    {
        return this.repository.update(id, data);
    }

    async findById(id: Id): Promise<SourceDocumentEntity>
    {
        return this.repository.findByIdOrThrow(id);
    }

    async delete(id: Id): Promise<SourceDocumentEntity>
    {
        return this.repository.delete(id);
    }

    async deleteMany(ids: Id[]): Promise<number>
    {
        return this.repository.deleteMany(ids);
    }

    async getList(query?: ListQueryParams): Promise<SourceDocumentEntity[]>
    {
        return this.repository.findAll(query);
    }

    async getCount(): Promise<number>
    {
        return this.repository.count();
    } 

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