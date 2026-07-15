import { Journal, JournalStatus } from "@prisma/client";
import { JournalRepository } from "../../../src/modules/journal/journal.repository";
import { JournalService } from "../../../src/modules/journal/journal.service";
import { Issn } from "../../../src/modules/journal/types/journal.types";
import { Id } from "../../../src/common/types/types";
import { prisma } from "../../../src/db/prisma";
import { UpdateJournalDto } from "../../../src/modules/journal/dto/journal.dto";

const journalService = new JournalService(new JournalRepository(prisma));

export const createJournal = async (overrides: {
    organizationId: Id, 
    name?: string,
    foundingYear?: number
    status?: JournalStatus, 
    issn?: Issn,
}): Promise<Journal> => {
    return journalService.create({
        organizationId: overrides.organizationId, 
        name: overrides.name ?? 'Tiszatáj',
        foundingYear: overrides.foundingYear ?? 1980,
        status: overrides.status ?? JournalStatus.PAUSE,
        issn: overrides.issn ?? '1234-567',
    });
};

export const findJournalById = async (id: Id): Promise<Journal | undefined> => 
    await journalService.findById(id);

export const findEveryJournal = async (): Promise<Journal[]> => 
    await journalService.findAll();

export const deleteJournal = async (id: Id): Promise<Journal> => 
    await journalService.delete(id);

export const updateJournal = async (id: Id, data: UpdateJournalDto): Promise<Journal> => 
    await journalService.update(id, data);