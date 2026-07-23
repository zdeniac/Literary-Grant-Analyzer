import { JournalFormat, JournalStatus } from "@prisma/client";
import { Issn, JournalWithAffiliatedOrganizationsAndSourceDocument } from "../../../../src/modules/journal/types/journal.types";
import { Id } from "../../../../src/common/types/types";
import { prisma } from "../../../../src/db/prisma";
import { JournalService } from "../../../../src/modules/journal/journal.service";
import { JournalRepository } from "../../../../src/modules/journal/journal.repository";
import { JournalAffiliationRepository } from "../../../../src/modules/journal-affiliation/journal-affiliation.repository";
import { CrudService } from "../../../../src/common/services/crud.service";
import { JournalDto, JournalModel } from "../../../../src/modules/journal/dto/journal.dto";
import { PrismaCrudRepository } from "../../../../src/db/repositories/prisma-crud-repository";
import { UpdateJournalWithAffiliationsInput } from "../../../../src/modules/journal/dto/journal.input.dto";

const journalAffiliationRepository = new JournalAffiliationRepository(prisma.journalAffiliation);
const journalService = new JournalService(
    new JournalRepository(prisma.journal),
    journalAffiliationRepository
);

const journalCrudService = new CrudService(
    new PrismaCrudRepository<JournalModel, JournalDto, JournalDto>(prisma.journal)
);

export const createJournal = async (overrides: {
    organizationId: Id, 
    name?: string,
    foundingYear?: number
    status?: JournalStatus,
    format?: JournalFormat[],
    issn?: Issn,
}): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument> => {
    const affiliations = [{
        fromYear: 2000,
        toYear: 2020,
        note: 'Test affiliation',
        isCurrent: true,
        organizationId: overrides.organizationId,
    },];

    return journalService.create({
        affiliations: affiliations, 
        name: overrides.name ?? 'Tiszatáj',
        foundingYear: overrides.foundingYear ?? 1980,
        status: overrides.status ?? JournalStatus.PAUSE,
        format: overrides.format ?? [JournalFormat.PRINT, JournalFormat.ONLINE],
        issn: overrides.issn ?? '12345683',
    });
};

export const updateJournal = async (id: Id, dto: UpdateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument> => 
    await journalService.update(id, dto);

export const findJournalById = async (id: Id): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument | null> => 
    await journalService.findByIdWithAffiliations(id);

export const findEveryJournal = async (): Promise<JournalModel[]> => 
    await journalCrudService.findAll();

export const deleteJournal = async (id: Id): Promise<JournalModel> => 
    await journalCrudService.delete(id);
