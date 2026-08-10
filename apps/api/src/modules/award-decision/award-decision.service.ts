import { NotFoundError } from "../../common/errors/http.error";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionService
{
    constructor(
        private readonly repository: AwardDecisionRepository
    ) {}

    async getList(): Promise<AwardDecisionEntityWithRelatedData[]>
    {
        return this.repository.findAllWithRelatedData();
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