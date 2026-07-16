import { ActorType, Organization } from "@prisma/client";
import { CreateOrganizationDto } from "./dto/organization.dto";
import { OrganizationRepository } from "./organization.repository";
import { ActorRepository } from "../actor/actor.repository";
import { Id } from "../../common/types/types";
import { transaction } from "../../db/transaction";

export class OrganizationService
{
    constructor(
        private readonly repository: OrganizationRepository,
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
            const organizationRepository = this.repository as OrganizationRepository;
            const actorRepository = this.actorRepository.withClient(tx);

            const organization = await organizationRepository
                .withClient(tx)
                .delete(id);

            await actorRepository.delete(organization.actorId);

            return organization;
        });
    }
}