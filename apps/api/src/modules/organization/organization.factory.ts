import { OrganizationService } from "./organization.service";
import { prisma } from "../../db/prisma";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { ActorRepository } from "../actor/actor.repository";
import { CrudService } from "../../common/services/crud.service";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { CrudController } from "../../common/controllers/crud.controller";

export const createOrganizationModule = () => {
    const crudRepository = new PrismaCrudRepository(prisma.organization);
    const crudService = new CrudService(crudRepository);
    
    const service = new OrganizationService(
        crudRepository,
        new ActorRepository(prisma.actor),
    );
    
    const controller = new OrganizationController(service, toOrganizationDto);
    const crudController = new CrudController(crudService, toOrganizationDto);

    return {
        controller,
        crudController,
    }
};