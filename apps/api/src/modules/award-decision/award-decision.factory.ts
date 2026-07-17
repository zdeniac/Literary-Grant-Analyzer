import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { AwardDecisionController } from "./award-decision.controller";
import { AwardDecisionService } from "./award-decision.service";
import { toAwardDecisionWithActorsDto } from "./mapper/award-decision-with-actors.mapper";
import { toAwardDecisionDto } from "./mapper/award-decision-mapper";
import { AwardDecisionRepository } from "./award-decision.repository";

export const createAwardDecisionModule = () => {
    const repository = new AwardDecisionRepository(prisma.awardDecision);

    const service = new AwardDecisionService(repository);
    const controller = new AwardDecisionController(service, toAwardDecisionWithActorsDto);

    const crudController = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.awardDecision)),
        toAwardDecisionDto,
    );

    return {
        controller,
        crudController,
    }
};