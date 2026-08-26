import { Id, ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { SourceDocumentEntity } from "./dto/source-document.dto";
import { CreateSourceDocumentInput, UpdateSourceDocumentInput } from "./dto/source-document.input.dto";

export class SourceDocumentRepository
{
    constructor(
        private readonly entity: Database['sourceDocument'],
        private readonly crud: CrudRepositoryInterface<
            SourceDocumentEntity, 
            CreateSourceDocumentInput, 
            UpdateSourceDocumentInput
        >,
        private readonly listQueryBuilder?: ListDbQueryBuilder,
    ) {}

    async create(data: CreateSourceDocumentInput): Promise<SourceDocumentEntity>
    {
        return this.crud.create(data);
    }

    async update(id: number, data: UpdateSourceDocumentInput): Promise<SourceDocumentEntity>
    {
        return this.crud.update(id, data);
    }
        
    async findByIdOrThrow(id: Id): Promise<SourceDocumentEntity>
    {
        return this.crud.findByIdOrThrow(id);
    }

    async findAll(query?: ListQueryParams): Promise<SourceDocumentEntity[]>
    {
        return this.entity.findMany(this.listQueryBuilder?.build(query));
    }

    async delete(id: Id): Promise<SourceDocumentEntity>
    {
        return this.crud.delete(id);
    }

    async findManyByUrls(urls: string[]): Promise<SourceDocumentEntity[]>
    {
        return this.entity.findMany({
            where: {
                url: {
                    in: urls,
                },
            },
        });
    }

    async createMany(data: CreateSourceDocumentInput[]): Promise<number>
    {
        const sourceDocs = await this.entity.createMany({
            data,
            skipDuplicates: true,
        });

        return sourceDocs.count;
    }
}