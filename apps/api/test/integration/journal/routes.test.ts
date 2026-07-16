import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { JournalStatus, LegalForm } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { OrganizationDto } from "../../../src/modules/organization/dto/organization.dto";

describe('Journal routes test', () => {

    const route = '/api/journals';
    const journalName = 'Tiszatáj';

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createOrganization = async (): Promise<OrganizationDto> => {
        const res = await request(app)
            .post('/api/organizations')
            .send({
                name: `Tiszatáj Alapítvány_${Date.now()}`,
                legalForm: LegalForm.FOUNDATION
            });
        return res.body.data;
    };

    const createJournal = async (data: {
        name?: string,
        status?: JournalStatus | string
    } = {}): Promise<request.Response> => {
        const org = await createOrganization();
        const res = await request(app)
            .post(route)
            .send({
                name: journalName ?? data.name,
                status: data.status ?? JournalStatus.ACTIVE,
                organizationId: org.id
            });
        return res;
    };

    const getJournal = (id: number) =>
        request(app)
            .get(`${route}/${id}`);

    const updateJournal = (
        id: number,
        data: object
    ) =>
        request(app)
            .patch(`${route}/${id}`)
            .send(data);

    const deleteJournal = (id: number) =>
        request(app)
            .delete(`${route}/${id}`);

    it('POST / creates journal', async () => {
        const org = await createOrganization();
        const res = await createJournal();
        console.log(res);
        expect(res.status).toBe(200);
        expect(res.body.data.name)
            .toBe('Tiszatáj');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createJournal({
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
            status: JournalStatus.CLOSED,
            organizationId: created.body.data.organizationId,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.name)
            .toBe('Tiszatáj upd');

        expect(res.body.data.status)
            .toBe('CLOSED');
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