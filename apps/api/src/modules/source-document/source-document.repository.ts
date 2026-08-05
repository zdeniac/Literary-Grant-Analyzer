import { Id } from "../../common/types/types";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { SourceDocumentEntity } from "./dto/source-document.dto";
import { CreateSourceDocumentInput } from "./dto/source-document.input.dto";

export class SourceDocumentRepository<
    Entity extends SourceDocumentEntity, 
    CreateInput extends CreateSourceDocumentInput
> implements CrudRepositoryInterface<Entity, CreateInput>
{
    constructor(
        private readonly crud: CrudRepositoryInterface<Entity, CreateInput>,
        private readonly entity: Database['sourceDocument']
    ) {}

    async create(data: CreateInput): Promise<Entity>
    {
        return this.crud.create(data);
    }

    async update(id: number, data: Partial<CreateInput>): Promise<Entity>
    {
        return this.crud.update(id, data);
    }
    
    async findById(id: number): Promise<Entity | null>
    {
        return this.crud.findById(id);
    }
    
    async findByIdOrThrow(id: Id): Promise<Entity>
    {
        return this.crud.delete(id);
    }

    async findAll(): Promise<Entity[]>
    {
        return this.crud.findAll();
    }

    async delete(id: Id): Promise<Entity>
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