import { Journal, JournalFormat, JournalStatus } from "@prisma/client";
import { Issn } from "../../../src/modules/journal/types/journal.types";
import { Id } from "../../../src/common/types/types";
import { CreateJournalWithAffiliationsInput, UpdateJournalWithAffiliationsInput } from "../../../src/modules/journal/dto/journal.dto";
import { CrudService } from "../../../src/common/services/crud.service";
import { PrismaCrudRepository } from "../../../src/db/repositories/prisma-crud-repository";
import { prisma } from "../../../src/db/prisma";

const journalService = new CrudService<
    Journal, 
    CreateJournalWithAffiliationsInput, 
    UpdateJournalWithAffiliationsInput
>(new PrismaCrudRepository(prisma.journal));

export const createJournal = async (overrides: {
    affiliationId: Id, 
    name?: string,
    foundingYear?: number
    status?: JournalStatus,
    format?: JournalFormat[],
    issn?: Issn,
}): Promise<Journal> => {
    return journalService.create({
        affiliationId: overrides.affiliationId, 
        name: overrides.name ?? 'Tiszatáj',
        foundingYear: overrides.foundingYear ?? 1980,
        status: overrides.status ?? JournalStatus.PAUSE,
        format: overrides.format ?? [JournalFormat.PRINT, JournalFormat.ONLINE],
        issn: overrides.issn ?? '1234-567',
    });
};

export const findJournalById = async (id: Id): Promise<Journal | undefined> => 
    await journalService.findById(id);

export const findEveryJournal = async (): Promise<Journal[]> => 
    await journalService.findAll();

export const deleteJournal = async (id: Id): Promise<Journal> => 
    await journalService.delete(id);

export const updateJournal = async (id: Id, data: UpdateJournalWithOrganizationsInput): Promise<Journal> => 
    await journalService.update(id, data);