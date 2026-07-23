import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "../../../src/db/prisma";
import { LegalForm, Sector } from "@prisma/client";
import { wipeDatabase } from "../helpers/db.helper";
import { createOrganization, deleteOrganization, findEveryOrganization, findOrganizationById, updateOrganization } from "../helpers/factories/organization.factory";

describe('OrganizationServiceTest', () => {
    const input = {
        name: 'Jelenkor Alapítvány',
        legalForm: LegalForm.LTD,
        sector: Sector.CIVIL,
        address: '7621 Pécs, Széchenyi tér 7-8',
        foundingYear: 1990,
    };

    beforeEach(wipeDatabase);
    afterAll(wipeDatabase);
    
    it('creates organization', async () => {
        const organization = await createOrganization(input);

        expect(organization).toMatchObject({
            name: input.name,
            legalForm: input.legalForm,
            sector: input.sector,
            address: input.address,
        });
    });

    it('finds organization by id', async () => {
        const created = await createOrganization({ name: 'Teszt' });
        const found = await findOrganizationById(created.id);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(created.name);
    });

    it('finds all organizationns', async () => {
        const org1 = await createOrganization({
            name: 'Alapítvány',
            legalForm: LegalForm.FOUNDATION,
            sector: Sector.CIVIL,
        });

        const org2 = await createOrganization({
            name: 'Kft',
            legalForm: LegalForm.LTD,
            sector: Sector.MARKET,
        });

        const org3 = await createOrganization({
            name: 'Nyrt',
            legalForm: LegalForm.PLC,
            sector: Sector.MARKET,
        });

        const found = await findEveryOrganization();

        expect(found.length).toBe(3);
        expect(found).toEqual(
            expect.arrayContaining([org1, org2, org3])
        );
        // Order of elements is intact
        expect(found.map(o => o.id)).toEqual([org1.id, org2.id, org3.id]);
    });

    it('updates organization', async () => {
        const created = await createOrganization({ name: 'Teszt', legalForm: LegalForm.OTHER });
        const updated = await updateOrganization(created.id, { name: 'Alapítvány upd' });

        expect(updated.updatedAt).toBeDefined();
        expect(updated).toMatchObject({
            id: created.id,
            name: 'Alapítvány upd',
            legalForm: LegalForm.OTHER,
            foundingYear: created.foundingYear,
            address: created.address,
            createdAt: created.createdAt,
        });
    });

    it('deletes organization', async () => {
        const created = await createOrganization({ name: 'Teszt' });
        await deleteOrganization(created.id);

        const deleted = await prisma.organization.findUnique({
            where: {
                id: created.id
            }
        });
        
        expect(deleted).toBeNull();
    });

    it('throws exception on querying for non-existent organization', async () => {
        await expect(
            findOrganizationById(999)
        ).rejects.toThrow();
    });

    it('throws exception on deleting non-existent organization', async () => {
        await expect(
            findOrganizationById(999)
        )
            .rejects
            .toThrow();
    });

    it('throws exception on updating non-existent organization', async () => {
        await expect(
            updateOrganization(999, { name: 'Alapítvány' })
        ).rejects.toThrow();
    });
});