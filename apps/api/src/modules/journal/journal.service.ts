import { NotFoundError } from "../../common/errors/http.error";
import { Id } from "../../common/types/types";
import { CreateJournalWithAffiliationsInput, UpdateJournalWithAffiliationsInput } from "./dto/journal.dto";
import { JournalRepository } from "./journal.repository";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "./types/journal.types";
import { JournalOrganizationRepository } from "../journal-affiliation/journal-affiliation.repository";

export class JournalService
{
    constructor(
        private readonly repository: JournalRepository,
        private readonly pivotRepository: JournalOrganizationRepository
    ) {
    }

    async create(dto: CreateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
    {
        return this.repository.createWithAffiliations(dto);
    }

    async update(id: Id, dto: UpdateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
    {
        const existing = await this.pivotRepository.findManyByJournalId(id)
        const existingById = new Map(
            existing.map(item => [item.id, item])
        );

        const affiliationIds = new Set(
            dto.affiliations!
                .filter(affiliation => affiliation?.id !== undefined)
                .map(affiliation => affiliation.id!)
        );

        // update + create
        for (const affiliation of dto.affiliations!) {
            if (affiliation.id) {
                const current = existingById.get(affiliation.id);

                if (!current) {
                    throw new Error(`JournalAffiliation ${affiliation.id} not found.`);
                }

                await this.pivotRepository.update(affiliation.id, {
                    fromYear: affiliation.fromYear,
                    toYear: affiliation.toYear,
                    note: affiliation.note,
                    sourceDocumentId: affiliation.sourceDocumentId,
                    isCurrent: affiliation.isCurrent,
                });
            } else {
                await this.pivotRepository.create({
                    journalId: id,
                    organizationId: affiliation.organizationId,
                    fromYear: affiliation.fromYear,
                    toYear: affiliation.toYear,
                    note: affiliation.note,
                    isCurrent: affiliation.isCurrent,
                    sourceDocumentId: affiliation.sourceDocumentId,
                });
            }
        }

        // delete
        for (const current of existing) {
            if (!affiliationIds.has(current.id)) {
                await this.pivotRepository.delete(current.id);
            }
        }

        return this.repository.findById(id);
    }

    async findByIdWithOrganizations(id: Id): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument | null>
    {
        const journal = await this.repository.findById(id);

        if (!journal) {
            throw new NotFoundError();
        }

        return journal;
    }
}