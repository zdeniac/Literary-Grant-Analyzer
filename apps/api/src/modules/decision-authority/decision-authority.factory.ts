import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { Database } from "../../db/types";
import { DecisionAuthorityController } from "./decision-authority.controller";
import { DecisionAuthorityRepository } from "./decision-authority.repository";
import { DecisionAuthorityService } from "./decision-authority.service";
import { toDecisionAuthorityDto } from "./mapper/decision-authority.mapper";

export const createDecisionAuthorityModule = () => {
    const service = new DecisionAuthorityService(
        createDecisionAuthorityRepository(prisma.decisionAuthority, true)
    );
    
    return {
        controller: new DecisionAuthorityController(service, toDecisionAuthorityDto),
    }
};

export const createDecisionAuthorityRepository = (decisionAuthority: Database['decisionAuthority'], withQueryBuilders?: boolean) => {
    const crudRepo = new PrismaCrudRepository(decisionAuthority);

    const listQb = withQueryBuilders ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    ) : undefined;

    return new DecisionAuthorityRepository(decisionAuthority, crudRepo, listQb);
}