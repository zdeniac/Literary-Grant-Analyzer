import { ActorType } from "@prisma/client";
import { OrganizationEntity } from "./dto/organization.dto";
import { Id, ListQueryParams } from "../../common/types/types";
import { transaction } from "../../db/transaction";
import { repositoryContainer } from "../../db/repositories/container";
import { CreateOrganizationInput, UpdateOrganizationInput } from "./dto/organization.input.dto";
import { OrganizationRepository } from "./organization.repository";

export class OrganizationService
{
    constructor(
        private readonly repository: OrganizationRepository
    ) {}

    async create(data: CreateOrganizationInput): Promise<OrganizationEntity>
    {
        return transaction(async tx => {
            const repositories = repositoryContainer(tx);

            const actor = await repositories.actor.create(
                ActorType.ORGANIZATION
            );

            return repositories.organization.create({
                ...data,
                actorId: actor.id,
            });
        });    
    }

    async update(id: Id, data: UpdateOrganizationInput): Promise<OrganizationEntity>
    {
        return this.repository.update(id, data);
    }

    async findById(id: Id): Promise<OrganizationEntity>
    {
        return this.repository.findByIdOrThrow(id);
    }

    async delete(id: Id): Promise<OrganizationEntity>
    {
        return transaction(async tx => {
            const organization = await repositoryContainer(tx).organization.delete(id);
            
            await repositoryContainer(tx).actor.delete(organization.actorId);

            return organization;
        });
    }

    async getList(query?: ListQueryParams): Promise<OrganizationEntity[]>
    {
        return this.repository.findAll(query);
    }
}