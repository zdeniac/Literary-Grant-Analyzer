import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { JournalFormat, JournalStatus } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { createJournal, deleteJournal, findEveryJournal, findJournalById, updateJournal } from "../helpers/factories/journal.factory";
import { createOrganization } from "../helpers/factories/organization.factory";
import { NotFoundError } from "../../../src/common/errors/http.error";
import { JournalService } from "../../../src/modules/journal/journal.service";
import { JournalRepository } from "../../../src/modules/journal/journal.repository";
import { JournalAffiliationRepository } from "../../../src/modules/journal-affiliation/journal-affiliation.repository";
import { prisma } from "../../../src/db/prisma";

describe('JournalServiceTest', () => {
    const journalInput = {
        name: 'Jelenkor',
        issn: '12345678',
        status: JournalStatus.ACTIVE,
        format: [JournalFormat.PRINT],
        foundingYear: 1990,
    };

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('creates journal only when it has at least one affiliation', async () => {
        const org = await createOrganization({ name: 'Teszt' });
        const journal = await createJournal({ 
            ...journalInput,
            organizationId: org.id,
            format: [JournalFormat.PRINT]
        });

        expect(journal).toMatchObject({
            name: journalInput.name,
            status: journalInput.status,
            issn: journalInput.issn,
            foundingYear: journalInput.foundingYear,
        });
        expect(journal.affiliations).toHaveLength(1);
        expect(journal.affiliations[0]).toMatchObject({
            organizationId: org.id,
        });
    });

    it('rejects journal creation without affiliations', async () => {
        const service = new JournalService(
            new JournalRepository(prisma.journal),
            new JournalAffiliationRepository(prisma.journalAffiliation)
        );

        await expect(service.create({
            name: 'Standalone journal',
            status: JournalStatus.ACTIVE,
            format: [JournalFormat.PRINT],
            issn: '12345679',
            affiliations: [],
        } as any)).rejects.toThrow();
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

    it('links the journal to the correct organization through an affiliation', async () => {
        const org = await createOrganization({ name: 'Teszt 3' });
        const created = await createJournal({ 
            ...journalInput,
            organizationId: org.id 
        });

        const found = await findJournalById(created.id);

        expect(found).not.toBeNull();
        expect(found?.affiliations).toHaveLength(1);
        expect(found?.affiliations[0]).toMatchObject({
            organizationId: org.id,
        });
    });

    it('finds all journals', async () => {
        const org = await createOrganization({ name: 'Teszt 4' });
        const j1 = await createJournal({
            name: 'Alföld',
            status: JournalStatus.ACTIVE,
            format: [JournalFormat.ONLINE],
            organizationId: org.id,
            issn: '12345680',
        });

        const j2 = await createJournal({
            name: 'Tiszatáj',
            status: JournalStatus.PAUSE,
            format: [JournalFormat.ONLINE, JournalFormat.PRINT],
            organizationId: org.id,
            issn: '12345681',
        });

        const j3 = await createJournal({
            name: 'Jelenkor',
            status: JournalStatus.CEASED,
            format: [JournalFormat.PRINT],
            organizationId: org.id,
            issn: '12345682',
        });

        const found = await findEveryJournal();

        expect(found.length).toBe(3);
        expect(found.map(journal => journal.id)).toEqual([j1.id, j2.id, j3.id]);
        expect(found.map(journal => journal.name)).toEqual(['Alföld', 'Tiszatáj', 'Jelenkor']);
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
                affiliations: [
                    {
                        id: created.affiliations[0].id,
                        organizationId: org2.id,
                        fromYear: 2000,
                        toYear: 2020,
                        note: 'Updated affiliation',
                        isCurrent: true,
                        sourceDocumentId: null,
                    },
                ],
            } as any
        );

        expect(updated.updatedAt).toBeDefined();
        expect(updated).toMatchObject({
            id: created.id,
            name: 'Teszt upd',
            status: JournalStatus.ACTIVE,
            foundingYear: created.foundingYear,
            createdAt: created.createdAt,
        });
        expect(updated.affiliations[0]).toMatchObject({
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