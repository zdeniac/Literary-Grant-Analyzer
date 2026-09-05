import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType, LegalForm, Sector } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createOrganization,
    deleteManyOrganizations,
    deleteOrganization,
    getOrganization,
    updateOrganization,
} from "../helpers/api/organization.api";
import { HttpStatusCode } from "../../../src/common/http/status-codes";
import { expectNotFound } from "../helpers/error.helper";

describe('Organization routes test', () => {

    const orgName = 'Tiszatáj Alapítvány';
    
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

    it('POST /organization creates organization', async () => {
        const res = await createOrganization();

        expect(res.status).toBe(HttpStatusCode.OK);
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
            legalForm: 'LegalForm.FOUNDATION' as unknown as LegalForm,
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /organizations/:id returns organization', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const res = await getOrganization(id);

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /organization/:id updates organization', async () => {
        const created = await createOrganization();
        const res = await updateOrganization(created.body.data.id, {
            name: 'Tiszatáj Alapítvány upd',
            legalForm: LegalForm.OTHER,
            sector: Sector.CIVIL,
        });

        expect(res.status).toBe(HttpStatusCode.OK);
        expect(res.body.data.name).toBe('Tiszatáj Alapítvány upd');
        expect(res.body.data.legalForm).toBe('OTHER');
        expect(res.body.data.sector).toBe('CIVIL');
    });

    it('PATCH /organization/:id rejects invalid payload', async () => {
        const created = await createOrganization();
        const res = await updateOrganization(created.body.data.id, {
            name: '',
            legalForm: 'LegalForm.OTHER' as unknown as LegalForm,
            sector: 'Sector.CIVIL' as unknown as Sector,
        });

        expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /organization deletes organization', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const res = await deleteOrganization(id);

        expect(res.status).toBe(HttpStatusCode.OK);

        const deleted = await getOrganization(id);
        
        expect(deleted.status).toBe(404);
    });

    it('DELETE /organization deletes actor', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const organization = await prisma.organization.findUniqueOrThrow({
            where: { id },
        });

        const res = await deleteOrganization(id);

        const actor = await prisma.actor.findUnique({
            where: { id: organization.actorId },
        });

        expect(actor).toBeNull();
    });

    it('DELETE / deletes many organizations', async () => {
        const created1 = await createOrganization({ name: 'Teszt1' });
        const created2 = await createOrganization({ name: 'Teszt2' });
        const created3 = await createOrganization({ name: 'Teszt3' });

        const id1 = created1.body.data.id;
        const id2 = created2.body.data.id;
        const id3 = created3.body.data.id;

        const ids = [
            id1,
            id2,
            id3,
        ];

        const res = await deleteManyOrganizations(ids);

        expect(res.status).toBe(HttpStatusCode.OK);

        await expectNotFound(getOrganization(ids[0]));
        await expectNotFound(getOrganization(ids[1]));
        await expectNotFound(getOrganization(ids[2]));
    });
});