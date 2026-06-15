import { Organization } from "@prisma/client";
import { OrganizationDto } from "../dto/organization.dto";

export const toOrganizationDto = (org: Organization): OrganizationDto => ({
	id: org.id,
    name: org.name,
    legalForm: org.legalForm,
    address: org.address,
    foundingYear: org.foundingYear,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
});