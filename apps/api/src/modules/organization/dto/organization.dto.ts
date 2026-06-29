import { LegalForm } from "@prisma/client";
import z from "zod";
import { OrganizationSchema } from "../validation/organization.schema";
import { Id, Year } from "../../../common/types/types";

export type OrganizationDto = {
    id: Id;
    name: string;
    legalForm: LegalForm;
    address: string | null;
    foundingYear: Year | null;
    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateOrganizationDto = z.infer<typeof OrganizationSchema>

export type UpdateOrganizationDto = {
    name?: string;
    legalForm?: LegalForm;
    address?: string;
    foundingYear?: Year;
};