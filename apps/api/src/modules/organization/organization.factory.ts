import { Organization } from "@prisma/client";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";
import { prisma } from "../../db/prisma";
import { OrganizationController } from "./organization.controller";
import { toOrganizationDto } from "./mapper/organization.mapper";

export const createOrganizationModule = () => {
    const service = new OrganizationService(
        new OrganizationRepository(prisma.organization)
    );

    const controller = new OrganizationController(service, toOrganizationDto);

    return {
        controller,   
    }
};