import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { CreateOrganizationData, CreateOrganizationDto } from "../dto/organization.dto";
import { ImportWriter } from "../../data-import/types/import.types";
import { createRepositories } from "../../../db/repositories/factory";

export class OrganizationImportWriter implements ImportWriter<CreateOrganizationData>
{
    async createMany(data: CreateOrganizationDto[]): Promise<number>
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