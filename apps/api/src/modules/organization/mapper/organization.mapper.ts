import { Organization } from "@prisma/client";
import { OrganizationDto } from "../dto/organization.dto";
import { Mapper } from "../../../common/types/types";

export const toOrganizationDto: Mapper<Organization, OrganizationDto> = (
    org
) => ({
	id: org.id,
    
    name: org.name,
    legalForm: org.legalForm,
    address: org.address,
    foundingYear: org.foundingYear,

    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
});