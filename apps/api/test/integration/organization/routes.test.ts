import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { ActorType, LegalForm, Sector } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { prisma } from "../../../src/db/prisma";
import {
    createOrganization,
    deleteOrganization,
    getOrganization,
    updateOrganization,
} from "../helpers/api/organization.api";

describe('Organization routes test', () => {

    const orgName = 'Tiszatáj Alapítvány';
    
    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);

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
            legalForm: 'LegalForm.FOUNDATION' as unknown as LegalForm,
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /organizations/:id returns organization', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const res = await getOrganization(id);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('PATCH /organization/:id updates organization', async () => {
        const created = await createOrganization();
        const res = await updateOrganization(created.body.data.id, {
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
        const res = await updateOrganization(created.body.data.id, {
            name: '',
            legalForm: 'LegalForm.OTHER' as unknown as LegalForm,
            sector: 'Sector.CIVIL' as unknown as Sector,
        });

        expect(res.status).toBe(422);
        expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('DELETE /organization deletes organization', async () => {
        const created = await createOrganization();
        const id = created.body.data.id;

        const res = await deleteOrganization(id);

        expect(res.status).toBe(204);

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

});