import { describe, it, expect, beforeEach } from "vitest";
import { JournalService } from "../../../src/modules/journal/journal.service";
import { Journal, JournalStatus } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { createOrganization } from "../organization/service.test";
import { Issn } from "../../../src/modules/journal/types/journal.types";
import { Id } from "../../../src/common/types/types";
import { JournalRepository } from "../../../src/modules/journal/journal.repository";

const journalService = new JournalService(new JournalRepository(prisma.journal));

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

describe('JournalServiceTest', () => {
    const journalInput = {
        name: 'Jelenkor',
        issn: '1234-567',
        status: JournalStatus.ACTIVE,
        foundingYear: 1990,
    };

    beforeEach(async () => {
        await prisma.journal.deleteMany();
        await prisma.organization.deleteMany();
    });

    it('creates journal', async () => {
        const org = await createOrganization();
        const journal = await createJournal({ 
            ...journalInput,
            organizationId: org.id 
        });

        expect(journal).toMatchObject({
            name: journalInput.name,
            status: journalInput.status,
            issn: journalInput.issn,
            foundingYear: journalInput.foundingYear,
            organizationId: org.id,
        });
    });

    it('finds journal by id', async () => {
        const org = await createOrganization();
        const created = await createJournal({ 
            ...journalInput,
            organizationId: org.id 
        });

        const found = await journalService.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(created.name);
    });

    it('journal belongs to correct organization', async () => {
        const org = await createOrganization();
        const created = await createJournal({ 
            ...journalInput,
            organizationId: org.id 
        });

        const found = await journalService.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.organizationId).toBe(org.id);
    });

    it('finds all journals', async () => {
        const org = await createOrganization();
        const j1 = await createJournal({
            name: 'Alföld',
            status: JournalStatus.ACTIVE,
            organizationId: org.id
        });

        const j2 = await createJournal({
            name: 'Tiszatáj',
            status: JournalStatus.PAUSE,
            organizationId: org.id
        });

        const j3 = await createJournal({
            name: 'Jelenkor',
            status: JournalStatus.CLOSED,
            organizationId: org.id
        });

        const found = await journalService.findAll();

        expect(found.length).toBe(3);
        expect(found).toEqual(
            expect.arrayContaining([j1, j2, j3])
        );
        // Order of elements is intact
        expect(found.map(o => o.id)).toEqual([j1.id, j2.id, j3.id]);
    });

    it('updates journal', async () => {
        const org = await createOrganization();

        const created = await createJournal({ 
            organizationId: org.id,
            status: JournalStatus.ACTIVE 
        });

        const org2 = await createOrganization();

        const updated = await journalService.update(
            created.id, 
            { 
                name: 'Teszt upd',
                organizationId: org2.id
            }
        );

        expect(updated.updatedAt).toBeDefined();
        expect(updated).toMatchObject({
            id: created.id,
            name: 'Teszt upd',
            status: JournalStatus.ACTIVE,
            foundingYear: created.foundingYear,
            createdAt: created.createdAt,
            organizationId: org2.id,
        });
    });

    it('deletes journal', async () => {
        const org = await createOrganization();

        const created = await createJournal({ organizationId: org.id });
        const deleted = await journalService.delete(created.id);
        
        // Returns the deleted org
        expect(deleted).toBeNullable();
    });

    it('throws exception on querying for non-existent journal', async () => {
        await expect(
            journalService.findById(999)
        ).rejects.toThrow();
    });

    it('throws exception on deleting non-existent journal', async () => {
        await expect(
            journalService.delete(999)
        ).rejects.toThrow();
    });

    it('throws exception on updating non-existent journal', async () => {
        await expect(
            journalService.update(999, { name: 'Teszt' })
        ).rejects.toThrow();
    });
});