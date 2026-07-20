import { JournalOrganization } from "@prisma/client";
import { Id } from "../../common/types/types";
import { PrismaDatabase } from "../../db/types";
import { CreateJournalOrganizationInput, UpdateJournalOrganizationInput } from "./dto/journal-organization.dto";

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

    async update(id: Id, data: UpdateJournalOrganizationInput): Promise<JournalOrganization>
    {
        return this.model.update({
            where: {
                id
            },
            data
        });
    }

    async create(data: CreateJournalOrganizationInput): Promise<JournalOrganization>
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