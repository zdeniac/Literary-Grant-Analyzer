import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { OrganizationRepository } from "./organization.repository";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";

export const createOrganizationModule = () => {
    const organization = prisma.organization;

    const crudRepo = new PrismaCrudRepository(organization);
    const repository = new OrganizationRepository(
        organization, 
        crudRepo, 
        new ListDbQueryBuilder()
    );

    const service = new OrganizationService(repository);
    const controller = new OrganizationController(service, toOrganizationDto);

    return {
        controller,
    }
};