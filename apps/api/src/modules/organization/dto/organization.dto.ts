import { LegalForm } from "@prisma/client";
import z from "zod";
import { OrganizationSchema } from "../validation/organization.schema";

export type OrganizationDto = {
    id: number;
    name: string;
    legalForm: LegalForm;
    address: string | null;
    foundingYear: number | null;
    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateOrganizationDto = z.infer<typeof OrganizationSchema>

export type UpdateOrganizationDto = {
    name?: string;
    legalForm?: LegalForm;
    address?: string;
    foundingYear?: number;
};