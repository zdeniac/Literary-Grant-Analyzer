import { LegalForm, Organization, Sector } from "@prisma/client";
import { prisma } from "../../../../src/db/prisma";
import { OrganizationService } from "../../../../src/modules/organization/organization.service";
import { Id } from "../../../../src/common/types/types";
import { CrudService } from "../../../../src/common/services/crud.service";
import { PrismaCrudRepository } from "../../../../src/db/repositories/prisma-crud-repository";
import { repositoryContainer } from "../../../../src/db/repositories/container";
import { UpdateOrganizationInput } from "../../../../src/modules/organization/dto/organization.input.dto";
import { OrganizationEntity } from "../../../../src/modules/organization/dto/organization.dto";

const repositories = repositoryContainer(prisma);

const organizationService = new OrganizationService(
    repositories.organization,
    repositories.actor,
);

const crudService = new CrudService(
    new PrismaCrudRepository(prisma.organization),
);

export const createOrganization = async (overrides: { 
    name: string, 
    legalForm?: LegalForm,
    sector?: Sector,
    address?: string, 
    foundingYear?: number
}): Promise<OrganizationEntity> => {
    return organizationService.create({
        name: overrides.name,
        legalForm: overrides.legalForm ?? LegalForm.LTD,
        sector: overrides.sector ?? Sector.CIVIL,
        address: overrides.address ?? '1234',
        foundingYear: overrides.foundingYear ?? 1990,
    });
};

export const findOrganizationById = async (id: Id): Promise<OrganizationEntity | undefined> => 
    await crudService.findById(id);

export const findEveryOrganization = async (): Promise<OrganizationEntity[]> => 
    await crudService.findAll();

export const deleteOrganization = async (id: Id): Promise<OrganizationEntity> => 
    await organizationService.delete(id);

export const updateOrganization = async (id: Id, data: UpdateOrganizationInput): Promise<OrganizationEntity> => 
    await crudService.update(id, data);
