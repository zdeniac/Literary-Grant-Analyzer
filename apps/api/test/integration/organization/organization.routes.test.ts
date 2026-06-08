import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { LegalForm } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { beforeEach } from "node:test";

beforeEach(async () => {
  await prisma.organization.deleteMany();
});

describe('Organization routes', () => {

    const createOrganization = async (data: {} = {
        name: 'Tiszatáj Alapítvány',
        legalForm: LegalForm.FOUNDATION,
    }) => {
        const res = await request(app)
            .post('/organizations')
            .send(data);

        return res;
    };

    it('POST /organization creates organization', async () => {
        const res = await createOrganization();

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Tiszatáj Alapítvány');
    });

    it('POST /organization rejects invalid payload', async () => {
        const res = await createOrganization({
            name: '',
            legalForm: 'LegalForm.FOUNDATION',
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /organizations/:id returns organization', async () => {
        const created = await createOrganization();

        const res = await request(app)
            .get(`/organizations/${created.body.id}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(created.body.id);
    });

    it('PUT /organization/:id updates organization', async () => {
        const created = await createOrganization();
        const res = await request(app)
            .put(`/organizations/${created.body.id}`)
            .send({
                name: 'Tiszatáj Alapítvány upd',
                legalForm: LegalForm.OTHER
            });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Tiszatáj Alapítvány upd');
        expect(res.body.legalForm).toBe('OTHER');
    });

    it('PUT /organization/:id rejects invalid payload', async () => {
        const created = await createOrganization();
        const res = await request(app)
            .put(`/organizations/${created.body.id}`)
            .send({
                name: '',
                legalForm: 'LegalForm.OTHER'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /organization deletes organization', async () => {
        const created = await createOrganization();
        const id = created.body.id;

        const res = await request(app)
            .delete(`/organizations/${id}`);

        expect(res.status).toBe(204);

        const deleted = await request(app)
            .get(`/organizations/${id}`);
        
        expect(deleted.status).toBe(404);
    });

});