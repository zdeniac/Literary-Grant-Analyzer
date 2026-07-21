import { ActorType } from "@prisma/client";
import { CreateDecisionBodyData, CreateDecisionBodyInput, DecisionBodyDto, UpdateDecisionBodyInput } from "./dto/decision-body.dto";
import { ActorRepository } from "../actor/actor.repository";
import { transaction } from "../../db/transaction";
import { Id } from "../../common/types/types";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { createRepositories } from "../../db/repositories/factory";

export class DecisionBodyService
{
    constructor(
        private readonly repository: PrismaCrudRepository<DecisionBodyDto, CreateDecisionBodyData, UpdateDecisionBodyInput>,
        private readonly actorRepository: ActorRepository,
    ) {
    }

    async create(dto: CreateDecisionBodyData): Promise<DecisionBodyDto>
    {
        const actor = await this.actorRepository.create(
            ActorType.DECISION_BODY
        );

        return this.repository.create({
            ...dto,
            actorId: actor.id,
        });
    }

    async delete(id: Id): Promise<DecisionBodyDto>
    {
        return transaction(async tx => {
            const repositories = createRepositories(tx);

            const decisionBody = await repositories.decisionBody.delete(id);

            await repositories.actor.delete(decisionBody.actorId);

            return decisionBody;
        });
    }
}