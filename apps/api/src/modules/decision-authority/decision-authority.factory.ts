import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { DecisionAuthorityController } from "./decision-authority.controller";
import { DecisionAuthorityRepository } from "./decision-authority.repository";
import { DecisionAuthorityService } from "./decision-authority.service";
import { toDecisionAuthorityDto } from "./mapper/decision-authority.mapper";

export const createDecisionAuthorityModule = () => {
    const entity = prisma.decisionAuthority;

    const crudRepository = new PrismaCrudRepository(entity);

    const authRepo = new DecisionAuthorityRepository(
        entity,
        crudRepository,
        new ListDbQueryBuilder(),
    )

    const service = new DecisionAuthorityService(authRepo);
    
    return {
        controller: new DecisionAuthorityController(service, toDecisionAuthorityDto),
    }
};