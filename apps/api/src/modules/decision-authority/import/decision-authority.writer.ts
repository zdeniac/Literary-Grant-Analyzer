import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { ImportWriterInterface } from "../../data-import/types/import.types";
import { createRepositories } from "../../../db/repositories/factory";
import { CreateDecisionAuthorityInput } from "../dto/decision-authority.input.dto";

export class DecisionAuthorityImportWriter implements ImportWriterInterface<CreateDecisionAuthorityInput>
{
    async createMany(data: CreateDecisionAuthorityInput[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = createRepositories(tx);

            const actorRepository = repositories.actor
            const dAuthRepository = repositories.decisionAuthority;

            for (const row of data) {
                const actor = await actorRepository.create(
                    ActorType.DECISION_AUTHORITY
                );

                await dAuthRepository.create({
                    ...row,
                    actorId: actor.id
                });
            }

            return data.length;
        });    
    }
}