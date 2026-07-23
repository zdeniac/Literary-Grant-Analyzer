import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { JournalStatus } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import {
    createJournal,
    deleteJournal,
    getJournal,
    updateJournal,
} from "../helpers/api/journal.api";

describe('Journal routes test', () => {

    const journalName = 'Tiszatáj';

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRouteJournal = async (data: {
        name?: string,
        status?: JournalStatus | string
    } = {}) => {
        return createJournal({
            name: data.name ?? journalName,
            status: data.status ?? JournalStatus.ACTIVE,
        });
    };

    it('POST / creates journal', async () => {
        const res = await createRouteJournal();
        expect(res.status).toBe(200);
        expect(res.body.data.name)
            .toBe('Tiszatáj');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createRouteJournal({
            name: '',
            status: 'invalid',
        });

        expect(res.status).toBe(422);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns journal', async () => {
        const created = await createJournal();

        const id = created.body.data.id;

        const res = await getJournal(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id)
            .toBe(id);
    });

    it('PATCH /:id updates journal', async () => {
        const created = await createJournal();

        const id = created.body.data.id;

        const res = await updateJournal(id, {
            name: 'Tiszatáj upd',
            status: JournalStatus.CEASED,
            organizationId: created.body.data.organizationId,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name)
            .toBe('Tiszatáj upd');

        expect(res.body.data.status)
            .toBe('CEASED');
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createJournal();

        const res = await updateJournal(
            created.body.data.id,
            {
                name: '',
                status: 'invalid',
            }
        );

        expect(res.status).toBe(422);
        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes journal', async () => {
        const created = await createJournal();

        const id = created.body.data.id;

        const res = await deleteJournal(id);

        expect(res.status).toBe(204);

        const deleted = await getJournal(id);

        expect(deleted.status)
            .toBe(404);
    });
});