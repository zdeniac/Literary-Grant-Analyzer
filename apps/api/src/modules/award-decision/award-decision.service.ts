import { NotFoundError } from "../../common/errors/http.error";
import { Id, ListQueryParams } from "../../common/types/types";
import { AwardDecisionRepository } from "./award-decision.repository";
import { CreateAwardDecisionInput, UpdateAwardDecisionInput } from "./dto/award-decision.input.dto";
import { AwardDecisionEntity, AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionService
{
    constructor(
        private readonly repository: AwardDecisionRepository
    ) {}

    async create(data: CreateAwardDecisionInput): Promise<AwardDecisionEntity>
    {
        return this.repository.create(data);
    }

    async update(id: Id, data: UpdateAwardDecisionInput): Promise<AwardDecisionEntity>
    {
        return this.repository.update(id, data);
    }

    async delete(id: Id): Promise<AwardDecisionEntity>
    {
        return this.repository.delete(id);
    }

    async deleteMany(ids: Id[]): Promise<number>
    {
        return this.repository.deleteMany(ids);
    }

    async getList(query?: ListQueryParams): Promise<AwardDecisionEntityWithRelatedData[]>
    {
        return this.repository.findAllWithRelatedData(query);
    }

    async findByIdWithRelations(id: Id): Promise<AwardDecisionEntity>
    {
        const entity = await this.repository.findByIdOrThrow(id);

        if (!entity) {
            throw new NotFoundError();
        }
        
        return entity;
    }
}