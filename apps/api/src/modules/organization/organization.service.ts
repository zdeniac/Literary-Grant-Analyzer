import { ActorType } from "@prisma/client";
import { OrganizationModel } from "./dto/organization.dto";
import { ActorRepository } from "../actor/actor.repository";
import { Id } from "../../common/types/types";
import { transaction } from "../../db/transaction";
import { CrudRepository } from "../../db/types";
import { createRepositories } from "../../db/repositories/factory";
import { CreateOrganizationInput, CreateOrganizationInputWithActorId, UpdateOrganizationInput } from "./dto/organization.input.dto";

export class OrganizationService
{
    constructor(
        private readonly repository: CrudRepository<
            OrganizationModel, 
            CreateOrganizationInputWithActorId, 
            UpdateOrganizationInput
        >,
        private readonly actorRepository: ActorRepository,
    ) {
    }

    async create(dto: CreateOrganizationInput): Promise<OrganizationModel>
    {
        const actor = await this.actorRepository.create(
            ActorType.ORGANIZATION
        );

        return this.repository.create({
            ...dto,
            actorId: actor.id,
        });
    }

    async delete(id: Id): Promise<OrganizationModel>
    {
        return transaction(async tx => {
            const organization = await createRepositories(tx).organization.delete(id);
            
            await createRepositories(tx).actor.delete(organization.actorId);

            return organization;
        });
    }
}