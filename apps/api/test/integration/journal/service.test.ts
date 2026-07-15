import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { JournalStatus } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { createJournal, deleteJournal, findEveryJournal, findJournalById, updateJournal } from "../factories/journal.factory";
import { createOrganization } from "../factories/organization.factory";
import { NotFoundError } from "../../../src/common/errors/http.error";

describe('JournalServiceTest', () => {
    const journalInput = {
        name: 'Jelenkor',
        issn: '1234-567',
        status: JournalStatus.ACTIVE,
        foundingYear: 1990,
    };

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('creates journal', async () => {
        const org = await createOrganization({ name: 'Teszt' });
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
        const org = await createOrganization({ name: 'Teszt 2' });
        const created = await createJournal({ 
            ...journalInput,
            organizationId: org.id 
        });

        const found = await findJournalById(created.id);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(created.name);
    });

    it('journal belongs to correct organization', async () => {
        const org = await createOrganization({ name: 'Teszt 3' });
        const created = await createJournal({ 
            ...journalInput,
            organizationId: org.id 
        });

        const found = await findJournalById(created.id);

        expect(found).not.toBeNull();
        expect(found?.organizationId).toBe(org.id);
    });

    it('finds all journals', async () => {
        const org = await createOrganization({ name: 'Teszt 4' });
        const j1 = await createJournal({
            name: 'Alföld',
            status: JournalStatus.ACTIVE,
            organizationId: org.id,
            issn: '1234-568',
        });

        const j2 = await createJournal({
            name: 'Tiszatáj',
            status: JournalStatus.PAUSE,
            organizationId: org.id,
            issn: '1234-569',
        });

        const j3 = await createJournal({
            name: 'Jelenkor',
            status: JournalStatus.CLOSED,
            organizationId: org.id,
            issn: '1234-510',
        });

        const found = await findEveryJournal();

        expect(found.length).toBe(3);
        expect(found).toEqual(
            expect.arrayContaining([j1, j2, j3])
        );
        // Order of elements is intact
        expect(found.map(o => o.id)).toEqual([j1.id, j2.id, j3.id]);
    });

    it('updates journal', async () => {
        const org = await createOrganization({ name: 'Teszt 5' });

        const created = await createJournal({ 
            organizationId: org.id,
            status: JournalStatus.ACTIVE 
        });

        const org2 = await createOrganization({ name: 'Teszt 6' });

        const updated = await updateJournal(
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
        const org = await createOrganization({ name: 'Teszt 7' });

        const created = await createJournal({ organizationId: org.id });
        await deleteJournal(created.id);

        await expect(findJournalById(created.id))
            .rejects
            .toThrow(NotFoundError);
    });

    it('throws exception on querying for non-existent journal', async () => {
        await expect(findJournalById(999))
            .rejects
            .toThrow();
    });

    it('throws exception on deleting non-existent journal', async () => {
        await expect(findJournalById(999))
            .rejects
            .toThrow();
    });

    it('throws exception on updating non-existent journal', async () => {
        await expect(
            updateJournal(999, { name: 'Teszt' }
        ))
            .rejects
            .toThrow();
    });
});