import { LegalForm, Organization } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { OrganizationService } from "../../../src/modules/organization/organization.service";
import { UpdateOrganizationDto } from "../../../src/modules/organization/dto/organization.dto";
import { Id } from "../../../src/common/types/types";
import { CrudService } from "../../../src/common/services/crud.service";
import { PrismaCrudRepository } from "../../../src/db/repositories/prisma-crud-repository";
import { createRepositories } from "../../../src/db/repositories/factory";

const repositories = createRepositories(prisma);

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
    await crudService.findById(id);

export const findEveryOrganization = async (): Promise<Organization[]> => 
    await crudService.findAll();

export const deleteOrganization = async (id: Id): Promise<Organization> => 
    await organizationService.delete(id);

export const updateOrganization = async (id: Id, data: UpdateOrganizationDto): Promise<Organization> => 
    await crudService.update(id, data);
