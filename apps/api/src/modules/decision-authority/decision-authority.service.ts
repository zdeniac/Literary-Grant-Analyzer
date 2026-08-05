import { ActorType } from "@prisma/client";
import { DecisionAuthorityDto } from "./dto/decision-authority.dto";
import { transaction } from "../../db/transaction";
import { Id } from "../../common/types/types";
import { repositoryContainer } from "../../db/repositories/container";
import { CreateDecisionAuthorityInput } from "./dto/decision-authority.input.dto";

export class DecisionAuthorityService
{
    async create(dto: CreateDecisionAuthorityInput): Promise<DecisionAuthorityDto>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const actor = await repositories.actor.create(
                ActorType.DECISION_AUTHORITY
            );

            return repositories.decisionAuthority.create({
                ...dto,
                actorId: actor.id,
            });
        });    
    }

    async delete(id: Id): Promise<DecisionAuthorityDto>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const decisionAuthority = await repositories.decisionAuthority.delete(id);

            await repositories.actor.delete(decisionAuthority.actorId);

            return decisionAuthority;
        });
    }
}