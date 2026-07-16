import { Journal, LegalForm, Organization } from "@prisma/client";
import { prisma } from "../../../src/db/prisma";
import { OrganizationRepository } from "../../../src/modules/organization/organization.repository";
import { OrganizationService } from "../../../src/modules/organization/organization.service";
import { UpdateOrganizationDto } from "../../../src/modules/organization/dto/organization.dto";
import { Id } from "../../../src/common/types/types";
import { ActorRepository } from "../../../src/modules/actor/actor.repository";
import { CrudService } from "../../../src/common/services/crud.service2";
import { PrismaCrudRepository } from "../../../src/db/prisma-crud-repository2";

const organizationService = new OrganizationService(
    new OrganizationRepository(prisma),
    new ActorRepository(prisma),
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
