import { ActorType, Organization } from "@prisma/client";
import { CreateOrganizationData, CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";
import { ActorRepository } from "../actor/actor.repository";
import { Id } from "../../common/types/types";
import { transaction } from "../../db/transaction";
import { CrudRepository, PrismaDatabase } from "../../db/types";
import { createRepositories } from "../../db/repositories/factory";

export class OrganizationService
{
    constructor(
        private readonly repository: CrudRepository<Organization, CreateOrganizationData, UpdateOrganizationDto>,
        private readonly actorRepository: ActorRepository,
    ) {
    }

    async create(dto: CreateOrganizationDto): Promise<Organization>
    {
        const actor = await this.actorRepository.create(
            ActorType.ORGANIZATION
        );

        return this.repository.create({
            ...dto,
            actorId: actor.id,
        });
    }

    async delete(id: Id): Promise<Organization>
    {
        return transaction(async tx => {
            const organization = await createRepositories(tx).organization.delete(id);
            
            await createRepositories(tx).actor.delete(organization.actorId);

            return organization;
        });
    }
}