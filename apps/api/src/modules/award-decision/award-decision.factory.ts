import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { AwardDecisionController } from "./award-decision.controller";
import { AwardDecisionService } from "./award-decision.service";
import { toAwardDecisionWithRelatedDataDto } from "./mapper/award-decision-with-related-data.mapper";
import { toAwardDecisionDto } from "./mapper/award-decision-mapper";
import { AwardDecisionRepository } from "./award-decision.repository";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";

export const createAwardDecisionModule = () => {
    const listQb = new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    );

    const repository = new AwardDecisionRepository(
        prisma.awardDecision,
        listQb,
    );

    const service = new AwardDecisionService(repository);
    const controller = new AwardDecisionController(service, toAwardDecisionWithRelatedDataDto);

    const crudController = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.awardDecision)),
        toAwardDecisionDto,
    );

    return {
        controller,
        crudController,
    }
};