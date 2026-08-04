import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { DecisionAuthorityController } from "./decision-authority.controller";
import { DecisionAuthorityService } from "./decision-authority.service";
import { toDecisionAuthorityDto } from "./mapper/decision-authority.mapper";

export const createDecisionAuthorityModule = () => {
    const crudRepository = new PrismaCrudRepository(prisma.decisionAuthority);
    const crudService = new CrudService(crudRepository);

    const service = new DecisionAuthorityService();
    
    return {
        controller: new DecisionAuthorityController(service, toDecisionAuthorityDto),
        crudController: new CrudController(crudService, toDecisionAuthorityDto)
    }
};