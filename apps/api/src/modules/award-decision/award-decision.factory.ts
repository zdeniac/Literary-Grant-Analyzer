import { prisma } from "../../db/prisma";
import { AwardDecisionController } from "./award-decision.controller";
import { AwardDecisionRepository } from "./award-decision.repository";
import { AwardDecisionService } from "./award-decision.service";
import { toAwardDecisionDto } from "./mapper/award-decision.mapper";

export const createAwardDecisionModule = () => {
    const service = new AwardDecisionService(new AwardDecisionRepository(prisma));
    const controller = new AwardDecisionController(service, toAwardDecisionDto);

    return {
        controller,
    }
};