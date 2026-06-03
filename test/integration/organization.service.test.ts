import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../../src/db/prisma";
import { OrganizationService } from "../../src/modules/organization/organization.service";
import { Organization, LegalForm } from "@prisma/client";

describe('OrganizationService', () => {

    const organizationService = new OrganizationService();

    beforeEach(async () => {
        await prisma.organization.deleteMany();
    });

    it('creates organization', async () => {
        const input = {
            name: 'Jelenkor Alapítvány',
            legalForm: LegalForm.LTD,
            address: '7621 Pécs, Széchenyi tér 7-8',
            foundingDate: new Date('1990')
        };

        const organization: Organization = await organizationService.create(
            input.name,
            input.legalForm,
            input.address,
            input.foundingDate,
        );

        expect(organization).toMatchObject(input);
    });

    it('finds organization by id', async () => {
        const created = await organizationService.create('Jelenkor Alapítvány', LegalForm.LTD);

        const found = await organizationService.findById(created.id);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(created.name);
    });

    // it('finds all organizationns', async () => {
    // });
    // update

});