import { NotFoundError } from "../../common/errors/http.error";
import { Id } from "../../common/types/types";
import { JournalRepository } from "./journal.repository";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "./types/journal.types";
import { JournalAffiliationRepository } from "../journal-affiliation/journal-affiliation.repository";
import { CreateJournalWithAffiliationsInput, UpdateJournalWithAffiliationsInput } from "./dto/journal.input.dto";
import { createJournalWithAffiliationsSchema } from "./validate/journal.schema";

export class JournalService
{
    constructor(
        private readonly repository: JournalRepository,
        private readonly affiliationRepository: JournalAffiliationRepository
    ) {
    }

    async create(dto: CreateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
    {
        const validatedDto = createJournalWithAffiliationsSchema.parse(dto);

        return this.repository.createWithAffiliations(validatedDto);
    }

    async update(id: Id, dto: UpdateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
    {
        await this.repository.findByIdWithAffiliations(id);

        const existing = await this.affiliationRepository.findManyByJournalId(id)
        const existingById = new Map(
            existing.map(item => [item.id, item])
        );

        if (dto.name !== undefined || dto.status !== undefined || dto.issn !== undefined || dto.format !== undefined || dto.foundingYear !== undefined) {
            await this.repository.update(id, {
                name: dto.name,
                status: dto.status,
                issn: dto.issn,
                format: dto.format,
                foundingYear: dto.foundingYear,
            });
        }

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

                await this.affiliationRepository.update(affiliation.id, {
                    organizationId: affiliation.organizationId,
                    fromYear: affiliation.fromYear,
                    toYear: affiliation.toYear,
                    note: affiliation.note,
                    sourceDocumentId: affiliation.sourceDocumentId,
                    isCurrent: affiliation.isCurrent,
                });
            } else {
                await this.affiliationRepository.create({
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
                await this.affiliationRepository.delete(current.id);
            }
        }

        return this.repository.findByIdWithAffiliations(id);
    }

    async findByIdWithAffiliations(id: Id): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument | null>
    {
        const journal = await this.repository.findByIdWithAffiliations(id);

        if (!journal) {
            throw new NotFoundError();
        }

        return journal;
    }
}