import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { ActorRepository } from "../actor/actor.repository";
import { DecisionBodyController } from "./decision-body.controller";
import { DecisionBodyService } from "./decision-body.service";
import { toDecisionBodyDto } from "./mapper/decision-body.mapper";

export const createDecisionBodyModule = () => {
    const crudRepository = new PrismaCrudRepository(prisma.decisionBody);
    const crudService = new CrudService(crudRepository);

    const service = new DecisionBodyService(
        crudRepository,
        new ActorRepository(prisma.actor),
    );
    
    return {
        controller: new DecisionBodyController(service, toDecisionBodyDto),
        crudController: new CrudController(crudService, toDecisionBodyDto)
    }
};