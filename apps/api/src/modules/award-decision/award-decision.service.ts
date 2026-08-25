import { NotFoundError } from "../../common/errors/http.error";
import { Id, ListQueryParams } from "../../common/types/types";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionEntity, AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionService
{
    constructor(
        private readonly repository: AwardDecisionRepository
    ) {}

    async getList(query?: ListQueryParams): Promise<AwardDecisionEntityWithRelatedData[]>
    {
        return this.repository.findAllWithRelatedData(query);
    }

    async findByIdWithRelations(id: Id): Promise<AwardDecisionEntityWithRelatedData>
    {
        const entity = await this.repository.findByIdWithRelatedData(id);

        if (!entity) {
            throw new NotFoundError();
        }
        
        return entity;
    }
}