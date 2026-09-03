import { JournalAffiliation } from "@prisma/client";
import { Id } from "../../common/types/types";
import { CrudRepositoryInterface, Database } from "../../db/types";
import { 
    CreateJournalAffiliationInput, 
    UpdateJournalAffiliationInput 
} from "./dto/journal-affiliation.input.dto";

export class JournalAffiliationRepository
{
    constructor(
        private readonly entity: Database['journalAffiliation'],
        private readonly crud: CrudRepositoryInterface<
            JournalAffiliation, 
            CreateJournalAffiliationInput, 
            UpdateJournalAffiliationInput
        >,
    ) {}

    async findManyByJournalId(journalId: Id): Promise<JournalAffiliation[]>
    {
        return this.entity.findMany({
            where: {
                journalId,
            }
        });
    }

    async update(id: Id, data: UpdateJournalAffiliationInput): Promise<JournalAffiliation>
    {
        return this.crud.update(id, data);
    }

    async create(data: CreateJournalAffiliationInput): Promise<JournalAffiliation>
    {
        return this.crud.create(data);
    }

    async createMany(data: CreateJournalAffiliationInput[]): Promise<number>
    {
        const result = await this.entity.createMany({
            data,
        });

        return result.count;
    }

    async delete(id: Id): Promise<JournalAffiliation>
    {
        return this.crud.delete(id);
    }
}