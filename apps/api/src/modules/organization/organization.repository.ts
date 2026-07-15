import { Organization } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { CreateOrganizationData, UpdateOrganizationDto } from "./dto/organization.dto";
import { PrismaModel } from "../../db/types";

export class OrganizationRepository 
    extends PrismaCrudRepository<Organization, CreateOrganizationData, UpdateOrganizationDto>
{
    protected get model(): PrismaModel<Organization>
    {
        return this.db.organization;
    }
}