import { ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { AwardSchemeEntity } from "./dto/award-scheme.dto";
import { CreateAwardSchemeInput, UpdateAwardSchemeInput } from "./dto/award-scheme.input.dto";

export class AwardSchemeRepository
{
    constructor(
        private readonly entity: Database['awardScheme'],
        private readonly crud: CrudRepositoryInterface<
            AwardSchemeEntity, 
            CreateAwardSchemeInput, 
            UpdateAwardSchemeInput
        >,
        private readonly listQueryBuilder?: ListDbQueryBuilder,
    ) {}

    async create(data: CreateAwardSchemeInput): Promise<AwardSchemeEntity>
    {
        return this.crud.create(data);
    }

    async findById(id: number): Promise<AwardSchemeEntity>
    {
        return this.crud.findByIdOrThrow(id);
    }

    async update(id: number, data: UpdateAwardSchemeInput): Promise<AwardSchemeEntity>
    {
        return this.crud.update(id, data);
    }

    async delete(id: number): Promise<AwardSchemeEntity>
    {
        return this.crud.delete(id);
    }

    async deleteMany(ids: number[]): Promise<number>
    {
        return this.crud.deleteMany(ids);
    }

    async count(): Promise<number>
    {
        return this.crud.count();
    }

    async findAll(query?: ListQueryParams): Promise<AwardSchemeEntity[]>
    {
        return this.entity.findMany(this.listQueryBuilder?.build(query))
    }
}