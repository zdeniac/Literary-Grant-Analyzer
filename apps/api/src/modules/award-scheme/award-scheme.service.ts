import { Id, ListQueryParams } from "../../common/types/types";
import { AwardSchemeRepository } from "./award-scheme.repository";
import { AwardSchemeEntity } from "./dto/award-scheme.dto";

export class AwardSchemeService
{
    constructor(
        private readonly repository: AwardSchemeRepository,
    ) {}

    async create(data: AwardSchemeEntity): Promise<AwardSchemeEntity>
    {
        return this.repository.create(data);
    }

    async findById(id: Id): Promise<AwardSchemeEntity>
    {
        return this.repository.findById(id);
    }

    async update(id: Id, data: AwardSchemeEntity): Promise<AwardSchemeEntity>
    {
        return this.repository.update(id, data);
    }

    async delete(id: Id): Promise<AwardSchemeEntity>
    {
        return this.repository.delete(id);
    }

    async deleteMany(ids: Id[]): Promise<number>
    {
        return this.repository.deleteMany(ids);
    }

    async getCount(): Promise<number>
    {
        return this.repository.count();
    }

    async getList(query?: ListQueryParams): Promise<AwardSchemeEntity[]>
    {
        return this.repository.findAll(query);
    }
}