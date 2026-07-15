import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { ActorRepository } from "../../actor/actor.repository";
import { ImportWriter } from "../../data-import/types/import.types";
import { DecisionBodyRepository } from "../decision-body.repository";
import { CreateDecisionBodyDto } from "../dto/decision-body.dto";

export class DecisionBodyImportWriter implements ImportWriter
{
    constructor(
        private readonly dBodyRepository: DecisionBodyRepository,
        private readonly actorRepository: ActorRepository,
    ) {}

    async createMany(data: CreateDecisionBodyDto[]): Promise<number>
    {
        return transaction(async (tx) => {
            const actorRepository = this.actorRepository.withClient(tx);
            const dBodyRepository = this.dBodyRepository.withClient(tx);

            for (const row of data) {
                const actor = await actorRepository.create(
                    ActorType.DECISION_BODY
                );

                await dBodyRepository.create({
                    ...row,
                    actorId: actor.id
                });
            }

            return data.length;
        });    
    }
}