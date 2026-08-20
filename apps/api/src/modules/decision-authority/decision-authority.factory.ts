import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { DecisionAuthorityController } from "./decision-authority.controller";
import { DecisionAuthorityRepository } from "./decision-authority.repository";
import { DecisionAuthorityService } from "./decision-authority.service";
import { toDecisionAuthorityDto } from "./mapper/decision-authority.mapper";

export const createDecisionAuthorityModule = () => {
    const entity = prisma.decisionAuthority;

    const crudRepository = new PrismaCrudRepository(entity);

    const listQb = new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    );

    const authRepo = new DecisionAuthorityRepository(
        entity,
        crudRepository,
        listQb,
    );

    const service = new DecisionAuthorityService(authRepo);
    
    return {
        controller: new DecisionAuthorityController(service, toDecisionAuthorityDto),
    }
};