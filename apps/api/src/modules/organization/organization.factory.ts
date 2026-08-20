import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { OrganizationRepository } from "./organization.repository";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";

export const createOrganizationModule = () => {
    const organization = prisma.organization;
    
    const listQb = new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    );

    const crudRepo = new PrismaCrudRepository(organization);
    const repository = new OrganizationRepository(
        organization,
        crudRepo,
        listQb,
    );

    const service = new OrganizationService(repository);
    const controller = new OrganizationController(service, toOrganizationDto);

    return {
        controller,
    }
};