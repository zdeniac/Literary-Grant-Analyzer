import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../../src/db/prisma";
import { OrganizationService } from "../../src/modules/organization/organization.service";
import { Organization, LegalForm } from "@prisma/client";

describe('OrganizationService', () => {

    const organizationService = new OrganizationService();
    
    const input = {
        name: 'Jelenkor Alapítvány',
        legalForm: LegalForm.LTD,
        address: '7621 Pécs, Széchenyi tér 7-8',
        foundingDate: new Date('1990'),
    };

    const createOrganization = async (overrides: { 
        name?:string, legalForm?: LegalForm, address?: string, foundingDate?: Date
    }) => {
        return organizationService.create(
            overrides.name ?? 'Jelenkor Alapítvány',
            overrides.legalForm ?? LegalForm.LTD,
            overrides.address,
            overrides.foundingDate
        );
    };

    beforeEach(async () => {
        await prisma.organization.deleteMany();
    });

    it('creates organization', async () => {
        const organization: Organization = await createOrganization(input);

        expect(organization).toMatchObject({
            name: input.name,
            legalForm: input.legalForm,
            address: input.address,
        });
    });

    it('finds organization by id', async () => {
        const created: Organization = await createOrganization({ 
            name: 'Jelenkor Alapítvány',
            legalForm: LegalForm.LTD
        });

        const found: Organization|null = await organizationService.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(created.name);
    });

    it('finds all organizationns', async () => {
        const org1: Organization = await createOrganization({
            name: 'Alapítvány',
            legalForm: LegalForm.FOUNDATION,
        });

        const org2: Organization = await createOrganization({
            name: 'Kft',
            legalForm: LegalForm.LTD
        });

        const org3: Organization = await createOrganization({
            name: 'Nyrt',
            legalForm: LegalForm.PLC
        });

        const found = await organizationService.findAll();

        expect(found.length).toBe(3);
        expect(found).toEqual(
            expect.arrayContaining([org1, org2, org3])
        );
    });

    it('updates organization', async () => {
        const created: Organization = await createOrganization({
            name: 'Alapítvány',
            legalForm: LegalForm.FOUNDATION
        });

        const updated: Organization = await organizationService.update(created.id, { name: 'Alapítvány upd' });

        expect(updated.name).toStrictEqual('Alapítvány upd');
    });

    it('deletes organization', async () => {
        const created: Organization = await createOrganization({ 
            name: 'Alapítvány', 
            legalForm: LegalForm.FOUNDATION
        });

        await organizationService.delete(created.id);
        
        const found: Organization|null = await organizationService.findById(created.id);

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