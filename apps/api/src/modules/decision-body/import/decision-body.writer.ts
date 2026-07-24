import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { ImportWriterInterface } from "../../data-import/types/import.types";
import { createRepositories } from "../../../db/repositories/factory";
import { CreateDecisionBodyInput } from "../dto/decision-body.input.dto";

export class DecisionBodyImportWriter implements ImportWriterInterface<CreateDecisionBodyInput>
{
    async createMany(data: CreateDecisionBodyInput[]): Promise<number>
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