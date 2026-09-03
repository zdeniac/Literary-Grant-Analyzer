import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { OrganizationRepository } from "./organization.repository";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { OrganizationSearchQueryBuilder } from "./query-builder/organization.search-query-builder";
import { Database } from "../../db/types";

export const createOrganizationModule = () => {
    const organization = prisma.organization;
    
    const listQb = new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new OrganizationSearchQueryBuilder(),
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

export const createOrganizationRepository = (entity: Database['organization'], withQueryBuilders?: boolean) => {
    const crudRepo = new PrismaCrudRepository(entity);

    const listQb = withQueryBuilders ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new OrganizationSearchQueryBuilder(),
    ) : undefined;

    return new OrganizationRepository(entity, crudRepo, listQb);
}