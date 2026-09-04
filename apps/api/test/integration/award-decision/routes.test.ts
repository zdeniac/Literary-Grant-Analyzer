import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { wipeDatabase } from "../helpers/db.helper";
import {
    createAwardDecision,
    deleteAwardDecision,
    getAwardDecision,
    updateAwardDecision,
} from "../helpers/api/award-decision.api";
import { HttpStatusCode } from "../../../src/common/http/status-codes";

describe('AwardDecision routes test', () => {
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createRouteAwardDecision = async (
        data: Partial<{
            amount: number;
            purpose: string;
            sourceIdentifier: string;
            decisionDate: string | Date;
        }> = {}
    ) => {
        return createAwardDecision(data);
    };

    it('POST / creates award decision', async () => {
        const res = await createRouteAwardDecision();

        expect(res.status).toBe(HttpStatusCode.CREATED);

        expect(res.body.data.purpose).toBe('Laptámogatás');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createRouteAwardDecision({
            decisionDate: '',
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns award decision', async () => {
        const decisionDate = new Date('2026-01-15 20:10:00');
        const created = await createAwardDecision({
            amount: 1000,
            purpose: 'Támogatás',
            decisionDate: decisionDate,
            sourceIdentifier: 'NKA-2026',
        });

        const id = created.body.data.id;
        const res = await getAwardDecision(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.id).toBe(id);
        expect(res.body.data.amount).toBe(String(1000));
        expect(res.body.data.purpose).toBe('Támogatás');
        expect(res.body.data.decisionDate).toBe(decisionDate.toISOString());
        expect(res.body.data.sourceIdentifier).toBe('NKA-2026');
    });

    it('PATCH /:id updates award decision', async () => {
        const created = await createAwardDecision();
        const id = created.body.data.id;

        const res = await updateAwardDecision(id, {
            purpose: 'Módosított cél',
        });

        expect(res.status).toBe(HttpStatusCode.OK);

        expect(res.body.data.purpose).toBe('Módosított cél');
    });

    it('PATCH /:id rejects invalid payload', async () => {
        const created = await createRouteAwardDecision();
        const res = await updateAwardDecision(
            created.body.data.id,
            {
                decisionDate: 'invalid-date',
            }
        );

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes award decision', async () => {
        const created = await createAwardDecision();
        const id = created.body.data.id;
        const res = await deleteAwardDecision(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const res2 = await getAwardDecision(id);

        expect(res2.status).toBe(HttpStatusCode.NOT_FOUND);
    });

    it('DELETE / deletes many award decisions', async () => {
        const created = await createAwardDecision();
        const id = created.body.data.id;
        const res = await deleteAwardDecision(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getAwardDecision(id);

        expect(deleted.status).toBe(HttpStatusCode.NOT_FOUND);
    });

});