import { ActorType } from "@prisma/client";
import { OrganizationModel } from "./dto/organization.dto";
import { Id } from "../../common/types/types";
import { transaction } from "../../db/transaction";
import { repositoryContainer } from "../../db/repositories/container";
import { CreateOrganizationInput } from "./dto/organization.input.dto";

export class OrganizationService
{
    async create(dto: CreateOrganizationInput): Promise<OrganizationModel>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const actor = await repositories.actor.create(
                ActorType.ORGANIZATION
            );

            return repositories.organization.create({
                ...dto,
                actorId: actor.id,
            });
        });    
    }

    async delete(id: Id): Promise<OrganizationModel>
    {
        return transaction(async tx => {
            const organization = await repositoryContainer(tx).organization.delete(id);
            
            await repositoryContainer(tx).actor.delete(organization.actorId);

            return organization;
        });
    }
}