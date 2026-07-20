import { NotFoundError } from "../../common/errors/http.error";
import { Id } from "../../common/types/types";
import { CreateJournalWithOrganizationsInput, UpdateJournalWithOrganizationsInput } from "./dto/journal.dto";
import { JournalRepository } from "./journal.repository";
import { JournalWithOrganizations } from "./types/journal.types";
import { JournalOrganizationRepository } from "../journal-organization/journal-organization.repository";

export class JournalService
{
    constructor(
        private readonly repository: JournalRepository,
        private readonly pivotRepository: JournalOrganizationRepository
    ) {
    }

    async create(dto: CreateJournalWithOrganizationsInput): Promise<JournalWithOrganizations>
    {
        return this.repository.createWithOrganizations(dto);
    }

    async update(id: Id, dto: UpdateJournalWithOrganizationsInput): Promise<JournalWithOrganizations>
    {
        const existing = await this.pivotRepository.findManyByJournalId(id)
        const existingById = new Map(
            existing.map(item => [item.id, item])
        );

        const pivotIds = new Set(
            dto.pivot
                .filter(pivot => pivot?.id !== undefined)
                .map(pivot => pivot.id!)
        );

        // update + create
        for (const pivot of dto.pivot) {
            if (pivot.id) {
                const current = existingById.get(pivot.id);

                if (!current) {
                    throw new Error(`JournalOrganization ${pivot.id} not found.`);
                }

                await this.pivotRepository.update(pivot.id, {
                    fromYear: pivot.fromYear,
                    toYear: pivot.toYear,
                    note: pivot.note,
                    sourceDocumentId: pivot.sourceDocumentId,
                });
            } else {
                await this.pivotRepository.create({
                    journalId: id,
                    organizationId: pivot.organizationId,
                    fromYear: pivot.fromYear,
                    toYear: pivot.toYear,
                    note: pivot.note,
                    sourceDocumentId: pivot.sourceDocumentId,
                });
            }
        }

        // delete
        for (const current of existing) {
            if (!pivotIds.has(current.id)) {
                await this.pivotRepository.delete(current.id);
            }
        }

        return this.repository.findById(id);
    }

    async findByIdWithOrganizations(id: Id): Promise<JournalWithOrganizations | null>
    {
        const journal = await this.repository.findById(id);

        if (!journal) {
            throw new NotFoundError();
        }

        return journal;
    }
}