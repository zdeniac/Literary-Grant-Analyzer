import { Organization } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";

export class OrganizationRepository extends PrismaCrudRepository<Organization, CreateOrganizationDto, UpdateOrganizationDto> {
    constructor(model: PrismaModel<Organization>) {
        super(model);
    }
}