import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { ImportWriter } from "../../data-import/types/import.types";
import { CreateDecisionBodyDto } from "../dto/decision-body.dto";
import { createRepositories } from "../../../db/repositories/factory";

export class DecisionBodyImportWriter implements ImportWriter<CreateDecisionBodyDto>
{
    async createMany(data: CreateDecisionBodyDto[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = createRepositories(tx);

            const actorRepository = repositories.actor
            const dBodyRepository = repositories.decisionBody;

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