import { ActorType } from "@prisma/client";
import { transaction } from "../../../db/transaction";
import { ActorRepository } from "../../actor/actor.repository";
import { CreateOrganizationDto } from "../dto/organization.dto";
import { OrganizationRepository } from "../organization.repository";
import { ImportWriter } from "../../data-import/types/import.types";

export class OrganizationImportWriter implements ImportWriter
{
    constructor(
        private readonly orgRepository: OrganizationRepository,
        private readonly actorRepository: ActorRepository,
    ) {}

    async createMany(data: CreateOrganizationDto[]): Promise<number>
    {
        return transaction(async (tx) => {
            const actorRepository = this.actorRepository.withClient(tx);
            const orgRepository = this.orgRepository.withClient(tx);

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