import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { JournalStatus } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import {
    createJournal,
    deleteJournal,
    deleteManyJournals,
    getJournal,
    updateJournal,
} from "../helpers/api/journal.api";
import { HttpStatusCode } from "../../../src/common/http/status-codes";
import { expectNotFound } from "../helpers/error.helper";

describe('Journal routes test', () => {
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const journalName = 'Tiszatáj';

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

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.name).toBe('Tiszatáj');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createRouteJournal({
            name: '',
            status: 'invalid',
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns journal', async () => {
        const created = await createJournal();

        const id = created.body.data.id;

        const res = await getJournal(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /:id updates journal', async () => {
        const created = await createJournal();

        const id = created.body.data.id;

        const res = await updateJournal(id, {
            name: 'Tiszatáj upd',
            status: JournalStatus.CEASED,
            organizationId: created.body.data.organizationId,
        });

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.name).toBe('Tiszatáj upd');
        expect(res.body.data.status).toBe('CEASED');
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

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes journal', async () => {
        const created = await createJournal();

        const id = created.body.data.id;

        const res = await deleteJournal(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getJournal(id);

        expect(deleted.status).toBe(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE / deletes many journals', async () => {
        const created1 = await createJournal({ issn: '12345684' });
        const created2 = await createJournal({ issn: '12345685' });
        const created3 = await createJournal({ issn: '12345686' });

        const id1 = created1.body.data.id;
        const id2 = created2.body.data.id;
        const id3 = created3.body.data.id;

        const ids = [
            id1,
            id2,
            id3,
        ];

        const res = await deleteManyJournals(ids);

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.status).toBe(HttpStatusCode.OK);

        await expectNotFound(getJournal(ids[0]));
        await expectNotFound(getJournal(ids[1]));
        await expectNotFound(getJournal(ids[2]));
    });
});