import { Organization } from "@prisma/client";
import { OrganizationDto } from "../dto/organization.dto";
import { DtoMapper } from "../../../common/types/types";

export const toOrganizationDto: DtoMapper<Organization, OrganizationDto> = (
    org
) => ({
	id: org.id,
    
    name: org.name,
    legalForm: org.legalForm,
    website: org.website,
    address: org.address,
    foundingYear: org.foundingYear,

    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
});