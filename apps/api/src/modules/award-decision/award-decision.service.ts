import { NotFoundError } from "../../common/errors/http.error";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionEntityWithActors } from "./types/award-decision.types";

export class AwardDecisionService
{
    constructor(
        private readonly repository: AwardDecisionRepository
    ) {}

    async findAllWithActors(): Promise<AwardDecisionEntityWithActors[]>
    {
        return this.repository.findAllWithActors();
    }

    async findByIdWithActors(id: number): Promise<AwardDecisionEntityWithActors>
    {
        const entity = await this.repository.findByIdWithActors(id);

        if (!entity) {
            throw new NotFoundError();
        }
        
        return entity;
    }
}