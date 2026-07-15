import { prisma } from "../../db/prisma";
import { ActorRepository } from "../actor/actor.repository";
import { DecisionBodyController } from "./decision-body.controller";
import { DecisionBodyRepository } from "./decision-body.repository";
import { DecisionBodyService } from "./decision-body.service";
import { toDecisionBodyDto } from "./mapper/decision-body.mapper";

export const createDecisionBodyModule = () => {
    const repository = new DecisionBodyRepository(prisma);
    
    const service = new DecisionBodyService(
        repository,
        new ActorRepository(prisma),
    );

    return {
        controller: new DecisionBodyController(service, toDecisionBodyDto),
    }
};