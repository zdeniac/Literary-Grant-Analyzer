import { JournalAffiliation } from "@prisma/client";
import { Id } from "../../common/types/types";
import { PrismaDatabase } from "../../db/types";
import { 
    CreateJournalAffiliationInput, 
    UpdateJournalAffiliationInput 
} from "./dto/journal-affiliation.input.dto";

export class JournalAffiliationRepository
{
    constructor(
        private readonly model: PrismaDatabase['journalAffiliation']
    ) {}

    async findManyByJournalId(journalId: Id): Promise<JournalAffiliation[]>
    {
        return this.model.findMany({
            where: {
                journalId,
            }
        });
    }

    async update(id: Id, data: UpdateJournalAffiliationInput): Promise<JournalAffiliation>
    {
        return this.model.update({
            where: {
                id
            },
            data
        });
    }

    async create(data: CreateJournalAffiliationInput): Promise<JournalAffiliation>
    {
        return this.model.create({ data });
    }

    async createMany(data: CreateJournalAffiliationInput[]): Promise<number>
    {
        const result = await this.model.createMany({
            data,
        });

        return result.count;
    }

    async delete(id: Id): Promise<JournalAffiliation>
    {
        return this.model.delete({
            where: {
                id
            },
        });
    }
}