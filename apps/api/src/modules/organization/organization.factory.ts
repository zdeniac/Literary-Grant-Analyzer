import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";
import { prisma } from "../../db/prisma";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { ActorRepository } from "../actor/actor.repository";
import { CrudService } from "../../common/services/crud.service2";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository2";
import { CrudController } from "../../common/controllers/crud.controller2";

export const createOrganizationModule = () => {
    const repository = new OrganizationRepository(prisma);
    const crudRepository = new PrismaCrudRepository(prisma.organization);
    const crudService = new CrudService(crudRepository);
    
    const service = new OrganizationService(
        repository,
        new ActorRepository(prisma),
    );
    
    const controller = new OrganizationController(service, toOrganizationDto);
    const crudController = new CrudController(crudService, toOrganizationDto);

    return {
        controller,
        crudController,
    }
};