import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { ImportWriterInterface } from "../../data-import/types/import.types";
import { createRepositories } from "../../../db/repositories/factory";
import { CreateOrganizationInput } from "../dto/organization.input.dto";

export class OrganizationImportWriter implements ImportWriterInterface<CreateOrganizationInput>
{
    async createMany(data: CreateOrganizationInput[]): Promise<number>
    {
        return transaction(async (tx) => {
            const repositories = createRepositories(tx);

            const actorRepository = repositories.actor;
            const orgRepository = repositories.organization;

            for (const row of data) {
                const actor = await actorRepository.create(
                    ActorType.ORGANIZATION
                );

                await orgRepository.create({
                    ...row,
                    actorId: actor.id
                });
            }

            return data.length;
        });    
    }
}