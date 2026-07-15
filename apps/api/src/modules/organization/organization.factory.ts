import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";
import { prisma } from "../../db/prisma";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { ActorRepository } from "../actor/actor.repository";

export const createOrganizationModule = () => {
    const service = new OrganizationService(
        new OrganizationRepository(prisma),
        new ActorRepository(prisma),
    );

    const controller = new OrganizationController(service, toOrganizationDto);

    return {
        controller,   
    }
};