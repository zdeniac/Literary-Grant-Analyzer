import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app";
import { ActorType, LegalForm, Sector } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";

describe('Organization routes test', () => {

    const route = '/api/organizations';
    const orgName = 'Tiszatáj Alapítvány';
    
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    const createOrganization = async (data: {} = {
        name: orgName,
        legalForm: LegalForm.FOUNDATION,
        sector: Sector.CIVIL,
    }) => {
        const res = await request(app)
            .post(route)
            .send(data);

        return res;
    };

    it('POST /organization creates organization', async () => {
        const res = await createOrganization();

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe(orgName);
    });

    it('POST /organization creates actor', async () => {
        const res = await createOrganization();

        const organization = await prisma.organization.findUniqueOrThrow({
            where: { id: res.body.data.id },
        });

        const actor = await prisma.actor.findUnique({
            where: { id: organization.actorId },
        });

        expect(actor).not.toBeNull();
        expect(actor?.type).toBe(ActorType.ORGANIZATION)
    });

    it('POST /organization rejects invalid payload', async () => {
        const res = await createOrganization({
            name: '',
            legalForm: 'LegalForm.FOUNDATION',
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /organizations/:id returns organization', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const res = await request(app)
            .get(`${route}/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /organization/:id updates organization', async () => {
        const created = await createOrganization();
        const res = await request(app)
            .patch(`${route}/${created.body.data.id}`)
            .send({
                name: 'Tiszatáj Alapítvány upd',
                legalForm: LegalForm.OTHER,
                sector: Sector.CIVIL,
            });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Tiszatáj Alapítvány upd');
        expect(res.body.data.legalForm).toBe('OTHER');
        expect(res.body.data.sector).toBe('CIVIL');
    });

    it('PATCH /organization/:id rejects invalid payload', async () => {
        const created = await createOrganization();
        const res = await request(app)
            .patch(`${route}/${created.body.data.id}`)
            .send({
                name: '',
                legalForm: 'LegalForm.OTHER',
                sector: 'Sector.CIVIL',
            });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /organization deletes organization', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const res = await request(app)
            .delete(`${route}/${id}`);

        expect(res.status).toBe(204);

        const deleted = await request(app)
            .get(`${route}/${id}`);
        
        expect(deleted.status).toBe(404);
    });

    it('DELETE /organization deletes actor', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const organization = await prisma.organization.findUniqueOrThrow({
            where: { id },
        });

        const res = await request(app)
            .delete(`${route}/${id}`);

        const actor = await prisma.actor.findUnique({
            where: { id: organization.actorId },
        });

        expect(actor).toBeNull();
    });

});