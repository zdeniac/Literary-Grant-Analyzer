import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { AwardDecisionController } from "./award-decision.controller";
import { AwardDecisionService } from "./award-decision.service";
import { toAwardDecisionWithRelatedDataDto } from "./mapper/award-decision-with-related-data.mapper";
import { toAwardDecisionDto } from "./mapper/award-decision-mapper";
import { AwardDecisionRepository } from "./award-decision.repository";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { AwardDecisionSearchQueryBuilder } from "./query-builder/award-decision.search-query-builder";
import { Database } from "../../db/types";
import { prisma } from "../../db/prisma";

export const createAwardDecisionModule = () => {
    const service = new AwardDecisionService(
        createAwardDecisionRepository(prisma.awardDecision, true)
    );
    const controller = new AwardDecisionController(
        service,
        toAwardDecisionDto,
        toAwardDecisionWithRelatedDataDto
    );

    return {
        controller,
    }
};

export const createAwardDecisionRepository = (awardDecision: Database['awardDecision'], withQueryBuilders?: boolean) => {
    const listQb = withQueryBuilders ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new AwardDecisionSearchQueryBuilder(),
    ) : undefined;

    const crudRepo = new PrismaCrudRepository(awardDecision);

    return new AwardDecisionRepository(
        awardDecision,
        crudRepo,
        listQb,
    );
}