import { ActorType, DecisionBody } from "@prisma/client";
import { DecisionBodyRepository } from "./decision-body.repository";
import { CreateDecisionBodyDto, UpdateDecisionBodyDto } from "./dto/decision-body.dto";
import { ActorRepository } from "../actor/actor.repository";
import { transaction } from "../../db/transaction";
import { Id } from "../../common/types/types";

export class DecisionBodyService
{
    constructor(
        private readonly repository: DecisionBodyRepository,
        private readonly actorRepository: ActorRepository,
    ) {
    }

    async create(dto: CreateDecisionBodyDto): Promise<DecisionBody>
    {
        const actor = await this.actorRepository.create(
            ActorType.DECISION_BODY
        );

        return this.repository.create({
            ...dto,
            actorId: actor.id,
        });
    }

    async delete(id: Id): Promise<DecisionBody> {
        return transaction(async tx => {
            const decisionBodyRepository = this.repository as DecisionBodyRepository;
            const actorRepository = this.actorRepository.withClient(tx);

            const decisionBody = await decisionBodyRepository
                .withClient(tx)
                .delete(id);

            await actorRepository.delete(decisionBody.actorId);

            return decisionBody;
        });
    }
}