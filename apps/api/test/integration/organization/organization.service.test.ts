import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../../../src/db/prisma";
import { OrganizationService } from "../../../src/modules/organization/organization.service";
import { LegalForm } from "@prisma/client";

describe('OrganizationService', () => {

    const organizationService = new OrganizationService();
    
    const input = {
        name: 'Jelenkor Alapítvány',
        legalForm: LegalForm.LTD,
        address: '7621 Pécs, Széchenyi tér 7-8',
        foundingDate: new Date('1990'),
    };

    const createOrganization = async (overrides: { 
        name?:string, 
        legalForm?: LegalForm, 
        address?: string, 
        foundingDate?: Date
    }) => {
        return organizationService.create({
            name: overrides.name ?? 'Jelenkor Alapítvány',
            legalForm: overrides.legalForm ?? LegalForm.LTD,
            address: overrides.address,
            foundingDate: overrides.foundingDate,
        });
    };

    beforeEach(async () => {
        await prisma.organization.deleteMany();
    });

    it('creates organization', async () => {
        const organization = await createOrganization(input);

        expect(organization).toMatchObject({
            name: input.name,
            legalForm: input.legalForm,
            address: input.address,
        });
    });

    it('finds organization by id', async () => {
        const created = await createOrganization({ 
            name: 'Jelenkor Alapítvány',
            legalForm: LegalForm.LTD,
        });

        const found = await organizationService.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(created.name);
    });

    it('finds all organizationns', async () => {
        const org1 = await createOrganization({
            name: 'Alapítvány',
            legalForm: LegalForm.FOUNDATION,
        });

        const org2 = await createOrganization({
            name: 'Kft',
            legalForm: LegalForm.LTD,
        });

        const org3 = await createOrganization({
            name: 'Nyrt',
            legalForm: LegalForm.PLC,
        });

        const found = await organizationService.findAll();

        expect(found.length).toBe(3);
        expect(found).toEqual(
            expect.arrayContaining([org1, org2, org3])
        );
    });

    it('updates organization', async () => {
        const created = await createOrganization({
            name: 'Alapítvány',
            legalForm: LegalForm.FOUNDATION,
        });

        const updated = await organizationService.update(created.id, { name: 'Alapítvány upd' });

        expect(updated.name).toStrictEqual('Alapítvány upd');
    });

    it('deletes organization', async () => {
        const created = await createOrganization({ 
            name: 'Alapítvány', 
            legalForm: LegalForm.FOUNDATION,
        });

        await organizationService.delete(created.id);
        
        const found = await organizationService.findById(created.id);

        expect(found).toBeNull();
    });

    it('throws exception on deleting non-existent organization', async () => {
        await expect(
            organizationService.delete(999)
        ).rejects.toThrow();
    });

    it('throws exception on updating non-existent organization', async () => {
        await expect(
            organizationService.update(999, { name: 'Alapítvány' })
        ).rejects.toThrow();
    });
});