import { JournalOrganization } from "@prisma/client";
import { Id } from "../../common/types/types";
import { PrismaDatabase } from "../../db/types";
import { CreateJournalAffiliationInput, UpdateJournalAffiliationInput } from "./dto/journal-affiliation.dto";

export class JournalOrganizationRepository
{
    constructor(
        private readonly model: PrismaDatabase['journalOrganization']
    ) {}

    async findManyByJournalId(journalId: Id): Promise<JournalOrganization[]>
    {
        return this.model.findMany({
            where: {
                journalId,
            }
        });
    }

    async update(id: Id, data: UpdateJournalAffiliationInput): Promise<JournalOrganization>
    {
        return this.model.update({
            where: {
                id
            },
            data
        });
    }

    async create(data: CreateJournalAffiliationInput): Promise<JournalOrganization>
    {
        return this.model.create({ data });
    }

    async delete(id: Id): Promise<JournalOrganization>
    {
        return this.model.delete({
            where: {
                id
            },
        });
    }
}