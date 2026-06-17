import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { JournalStatus, LegalForm } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { beforeEach } from "node:test";

describe('Journal routes test', () => {

    const route = '/api/journals';

    const createJournal = async (data: {
        name: string,
        status: JournalStatus | string
    } = {
        name: 'Tiszatáj',
        status: JournalStatus.ACTIVE,
    }) => {
        const orgRes = await request(app)
            .post('/api/organizations')
            .send({
                name: 'Tiszatáj Alapítvány',
                legalForm: LegalForm.FOUNDATION
            });

        const res = await request(app)
            .post(route)
            .send({
                organizationId: orgRes.body.data.id,
                ...data
            });

        return res;
    };

    beforeEach(async () => {
        await prisma.journal.deleteMany();
        await prisma.organization.deleteMany();
    });

    it('POST / creates journal', async () => {
        const res = await createJournal();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Tiszatáj');
    });

    it('POST / rejects invalid payload', async () => {
        const res = await createJournal({
            name: '',
            status: 'bsss'
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /:id returns journal', async () => {
        const created = await createJournal();
        const id = created.body.data.id;

        const res = await request(app)
            .get(`${route}/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PUT /:id updates journal', async () => {
        const created = await createJournal();
        const res = await request(app)
            .put(`${route}/${created.body.data.id}`)
            .send({
                name: 'Tiszatáj upd',
                status: JournalStatus.CLOSED,
                organizationId: created.body.data.organizationId
            });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Tiszatáj upd');
        expect(res.body.data.status).toBe('CLOSED');
    });

    it('PUT /:id rejects invalid payload', async () => {
        const created = await createJournal();
        const res = await request(app)
            .put(`${route}/${created.body.data.id}`)
            .send({
                name: '',
                status: 'dsadas'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /:id deletes journal', async () => {
        const created = await createJournal();
        const id = created.body.data.id;

        const res = await request(app)
            .delete(`${route}/${id}`);

        expect(res.status).toBe(204);

        const deleted = await request(app)
            .get(`${route}/${id}`);
        
        expect(deleted.status).toBe(404);
    });
});