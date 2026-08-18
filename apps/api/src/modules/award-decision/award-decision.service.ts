import { NotFoundError } from "../../common/errors/http.error";
import { ListQueryParams } from "../../common/types/types";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionSortableField, AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionService
{
    constructor(
        private readonly repository: AwardDecisionRepository
    ) {}

    async getList(query?: ListQueryParams<AwardDecisionSortableField>): Promise<AwardDecisionEntityWithRelatedData[]>
    {
        return this.repository.findAllWithRelatedData(query);
    }

    async findByIdWithRelations(id: number): Promise<AwardDecisionEntityWithRelatedData>
    {
        const entity = await this.repository.findByIdWithRelatedData(id);

        if (!entity) {
            throw new NotFoundError();
        }
        
        return entity;
    }
}