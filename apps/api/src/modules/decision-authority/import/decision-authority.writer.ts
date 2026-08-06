import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { repositoryContainer } from "../../../db/repositories/container";
import { CreateDecisionAuthorityInput } from "../dto/decision-authority.input.dto";
import { ImportWriterInterface } from "../../data-import/types/service.types";

export class DecisionAuthorityImportWriter implements ImportWriterInterface<CreateDecisionAuthorityInput>
{
    async createMany(data: CreateDecisionAuthorityInput[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = repositoryContainer(tx);

            const actorRepository = repositories.actor
            const dAuthRepository = repositories.decisionAuthority;

            for (const row of data) {
                const actor = await actorRepository.create(
                    ActorType.DECISION_AUTHORITY
                );

                await dAuthRepository.create({
                    name: row.name,
                    organizationId: row.organizationId,
                    actorId: actor.id,
                });
            }

            return data.length;
        });    
    }
}