import { ActorType } from "@prisma/client";
import { DecisionAuthorityDto } from "./dto/decision-authority.dto";
import { ActorRepository } from "../actor/actor.repository";
import { transaction } from "../../db/transaction";
import { Id } from "../../common/types/types";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { createRepositories } from "../../db/repositories/factory";
import { CreateDecisionAuthorityData, CreateDecisionAuthorityInput, UpdateDecisionAuthorityInput } from "./dto/decision-authority.input.dto";

export class DecisionAuthorityService
{
    constructor(
        private readonly repository: PrismaCrudRepository<DecisionAuthorityDto, CreateDecisionAuthorityData, UpdateDecisionAuthorityInput>,
        private readonly actorRepository: ActorRepository,
    ) {
    }

    async create(dto: CreateDecisionAuthorityInput): Promise<DecisionAuthorityDto>
    {
        const actor = await this.actorRepository.create(
            ActorType.DECISION_AUTHORITY
        );
        return this.repository.create({
            ...dto,
            actorId: actor.id,
        });
    }

    async delete(id: Id): Promise<DecisionAuthorityDto>
    {
        return transaction(async tx => {
            const repositories = createRepositories(tx);

            const decisionAuthority = await repositories.decisionAuthority.delete(id);

            await repositories.actor.delete(decisionAuthority.actorId);

            return decisionAuthority;
        });
    }
}