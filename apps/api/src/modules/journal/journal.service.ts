import { NotFoundError } from "../../common/errors/http.error";
import { Id, ListQueryParams } from "../../common/types/types";
import { JournalRepository } from "./journal.repository";
import { JournalWithOrganizations, JournalWithOrganizationsAndSourceDocument } from "./types/journal.types";
import { JournalAffiliationRepository } from "../journal-affiliation/journal-affiliation.repository";
import { CreateJournalWithAffiliationsInput, UpdateJournalWithAffiliationsInput } from "./dto/journal.input.dto";
import { createJournalWithAffiliationsSchema } from "./validate/journal.schema";
import { CreateJournalAffiliationInput, UpdateJournalAffiliationWithIdInput } from "../journal-affiliation/dto/journal-affiliation.input.dto";
import { JournalAffiliationEntity } from "../journal-affiliation/dto/journal-affiliation.dto";
import { JournalEntity } from "./dto/journal.dto";

export class JournalService
{
    constructor(
        private readonly repository: JournalRepository,
        private readonly affiliationRepository: JournalAffiliationRepository
    ) {
    }

    async create(dto: CreateJournalWithAffiliationsInput): Promise<JournalWithOrganizationsAndSourceDocument>
    {
        const validatedDto = createJournalWithAffiliationsSchema.parse(dto);

        return this.repository.createWithAffiliations(validatedDto);
    }

    async update(id: Id, dto: UpdateJournalWithAffiliationsInput): Promise<JournalWithOrganizationsAndSourceDocument>
    {
        await this.repository.findByIdWithOrganizationsAndSourceDocument(id);

        const existingAffiliations = await this.affiliationRepository.findManyByJournalId(id)
        const existingAffiliationsMap = new Map(existingAffiliations.map(item => [item.id, item]));

        if (
            dto.name !== undefined || 
            dto.status !== undefined || 
            dto.issn !== undefined || 
            dto.format !== undefined || 
            dto.foundingYear !== undefined
        ) {
            await this.repository.updateWithOrganizationsAndSourceDocument(id, {
                name: dto.name,
                status: dto.status,
                issn: dto.issn,
                format: dto.format,
                foundingYear: dto.foundingYear,
            });
        }

        const incomingAffiliations = dto.affiliations;
        if (incomingAffiliations) {
            for (const affiliation of incomingAffiliations) {
                if ('id' in affiliation) {
                    if (!existingAffiliationsMap.has(affiliation.id)) {
                        throw new NotFoundError(`JournalAffiliation ${affiliation.id} not found.`);
                    }

                    await this.updateJournalAffiliation(affiliation);
                } else {
                    await this.createJournalAffiliation(id, affiliation);
                }
            }

            await this.deleteJournalAffiliation(existingAffiliations, incomingAffiliations);
        }

        return this.repository.findByIdWithOrganizationsAndSourceDocument(id);
    }

    async delete(id: Id): Promise<JournalEntity>
    {
        return this.repository.delete(id);
    }

    async deleteMany(ids: Id[]): Promise<number>
    {
        return this.repository.deleteMany(ids);
    }

    async findByIdWithAffiliations(id: Id): Promise<JournalWithOrganizationsAndSourceDocument | null>
    {
        const journal = await this.repository.findByIdWithOrganizationsAndSourceDocument(id);

        if (!journal) {
            throw new NotFoundError();
        }

        return journal;
    }

    async getList(query?: ListQueryParams): Promise<JournalWithOrganizations[]>
    {
        return this.repository.findAllWithOrganizations(query);
    }

    private async updateJournalAffiliation(affiliation: UpdateJournalAffiliationWithIdInput): Promise<void>
    {
        await this.affiliationRepository.update(
            affiliation.id, 
            {
                fromYear: affiliation.fromYear,
                toYear: affiliation.toYear,
                note: affiliation.note,
                sourceDocumentId: affiliation.sourceDocumentId,
                isCurrent: affiliation.isCurrent,
            }
        );
    }

    private async createJournalAffiliation(journalId: Id, affiliation: CreateJournalAffiliationInput): Promise<void>
    {
        await this.affiliationRepository.create({
            ...affiliation,
            journalId,
        });
    }

    private async deleteJournalAffiliation(
        existing: JournalAffiliationEntity[], 
        incoming: Array<UpdateJournalAffiliationWithIdInput | CreateJournalAffiliationInput>
    ): Promise<void> {
        const affiliationIds = new Set(
            incoming
                .filter(affiliation => 'id' in affiliation)
                .map(affiliation => affiliation.id)
        );

        for (const current of existing) {
            if (!affiliationIds.has(current.id)) {
                await this.affiliationRepository.delete(current.id);
            }
        }
    }
}