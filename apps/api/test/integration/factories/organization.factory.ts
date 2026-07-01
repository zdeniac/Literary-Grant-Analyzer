import { Journal, LegalForm, Organization } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { OrganizationRepository } from "../../../src/modules/organization/organization.repository";
import { OrganizationService } from "../../../src/modules/organization/organization.service";
import { UpdateOrganizationDto } from "../../../src/modules/organization/dto/organization.dto";
import { Id } from "../../../src/common/types/types";

const organizationService = new OrganizationService(
    new OrganizationRepository(prisma.organization)
);

export const createOrganization = async (overrides: { 
    name: string, 
    legalForm?: LegalForm, 
    address?: string, 
    foundingYear?: number
}): Promise<Organization> => {
    return organizationService.create({
        name: overrides.name,
        legalForm: overrides.legalForm ?? LegalForm.LTD,
        address: overrides.address ?? '1234',
        foundingYear: overrides.foundingYear ?? 1990,
    });
};

export const findOrganizationById = async (id: Id): Promise<Organization | undefined> => 
    await organizationService.findById(id);

export const findEveryOrganization = async (): Promise<Organization[]> => 
    await organizationService.findAll();

export const deleteOrganization = async (id: Id): Promise<void> => 
    await organizationService.delete(id);

export const updateOrganization = async (id: Id, data: UpdateOrganizationDto): Promise<Organization> => 
    await organizationService.update(id, data);
