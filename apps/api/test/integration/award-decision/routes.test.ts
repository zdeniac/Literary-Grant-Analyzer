import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { wipeDatabase } from "../helpers/db.helper";
import {
    createAwardDecision,
    deleteAwardDecision,
    getAwardDecision,
    updateAwardDecision,
} from "../helpers/api/award-decision.api";

describe('AwardDecision routes test', () => {

    const route = '/api/award-decisions';

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

        expect(res.status)
            .toBe(200);

        expect(res.body.data.purpose)
            .toBe('Laptámogatás');
    });

    it('POST / rejects invalid payload', async () => {

        const res = await createRouteAwardDecision({
            decisionDate: '',
        });

        expect(res.status)
            .toBe(422);

        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns award decision with actors', async () => {
        const created = await createAwardDecision();

        expect(created.status)
            .toBe(200);

        const id = created.body.data.id;
        const res = await getAwardDecision(id);

        expect(res.status).toBe(200);

        expect(res.body.data.id).toBe(id);

        expect(res.body.data.decisionMakerName)
            .toBe('Nemzeti Kulturális Alap');

        expect(res.body.data.recipientName)
            .toBe('Jelenkor Alapítvány');
    });

    it('PATCH /:id updates award decision', async () => {

        const created = await createAwardDecision();
        const id = created.body.data.id;

        const res = await updateAwardDecision(id, {
            purpose: 'Módosított cél',
        });

        expect(res.status).toBe(200);

        expect(res.body.data.purpose)
            .toBe('Módosított cél');
    });

    it('PATCH /:id rejects invalid payload', async () => {

        const created = await createRouteAwardDecision();
        const res = await updateAwardDecision(
            created.body.data.id,
            {
                decisionDate: 'invalid-date',
            }
        );

        expect(res.status)
            .toBe(422);

        expect(res.body.error)
            .toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes award decision', async () => {
        const created = await createAwardDecision();
        const id = created.body.data.id;
        const res = await deleteAwardDecision(id);

        expect(res.status)
            .toBe(204);

        const deleted = await getAwardDecision(id);

        expect(deleted.status)
            .toBe(404);
    });

});