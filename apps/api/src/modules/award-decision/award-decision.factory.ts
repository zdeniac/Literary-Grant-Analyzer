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
import { AwardDecisionSortableField } from "./types/award-decision.types";

export const createAwardDecisionModule = () => {
    const repository = new AwardDecisionRepository(
        prisma.awardDecision,
        new ListDbQueryBuilder<AwardDecisionSortableField>(),
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