import { NotFoundError } from "../../common/errors/http.error";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionWithRelations } from "./types/award-decision.types";

export class AwardDecisionService
{
    constructor(
        private readonly repository: AwardDecisionRepository
    ) {}

    async findAllWithActors(): Promise<AwardDecisionWithRelations[]>
    {
        return this.repository.findAllWithActors();
    }

    async findByIdWithActors(id: number): Promise<AwardDecisionWithRelations>
    {
        const model = await this.repository.findByIdWithActors(id);

        if (!model) {
            throw new NotFoundError();
        }
        
        return model;
    }
}