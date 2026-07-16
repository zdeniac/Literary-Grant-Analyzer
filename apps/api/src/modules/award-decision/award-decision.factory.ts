import { AwardDecision } from "@prisma/client";
import { CrudController } from "../../common/controllers/crud.controller2";
import { CrudService } from "../../common/services/crud.service2";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository2";
import { AwardDecisionController } from "./award-decision.controller";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionService } from "./award-decision.service";
import { toAwardDecisionWithActorsDto } from "./mapper/award-decision-with-actors.mapper";
import { toAwardDecisionDto } from "./mapper/award-decision-mapper";

export const createAwardDecisionModule = () => {
    const service = new AwardDecisionService(new AwardDecisionRepository());
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