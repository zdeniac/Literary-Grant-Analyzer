import { CrudController } from "../../common/controllers/crud.controller2";
import { CrudService } from "../../common/services/crud.service2";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository2";
import { ActorRepository } from "../actor/actor.repository";
import { DecisionBodyController } from "./decision-body.controller";
import { DecisionBodyRepository } from "./decision-body.repository";
import { DecisionBodyService } from "./decision-body.service";
import { toDecisionBodyDto } from "./mapper/decision-body.mapper";

export const createDecisionBodyModule = () => {
    const crudRepository = new PrismaCrudRepository(prisma.decisionBody);
    const crudService = new CrudService(crudRepository);
    
    const service = new DecisionBodyService(
        new DecisionBodyRepository(prisma),
        new ActorRepository(prisma),
    );
    
    return {
        controller: new DecisionBodyController(service, toDecisionBodyDto),
        crudController: new CrudController(crudService, toDecisionBodyDto)
    }
};