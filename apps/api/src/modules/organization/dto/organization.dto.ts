import { LegalForm } from "@prisma/client";
import z from "zod";
import { OrganizationSchema } from "../validation/organization.schema";
import { Id, Year } from "../../../common/types/types";

export type OrganizationDto = {
    id: Id;
    
    name: string;
    website: string | null;
    legalForm: LegalForm;
    address: string | null;
    foundingYear: Year | null;
    
    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateOrganizationDto = z.infer<typeof OrganizationSchema>;

export type CreateOrganizationData = CreateOrganizationDto & {
    actorId: Id;
};

export type UpdateOrganizationDto = Partial<CreateOrganizationDto>;