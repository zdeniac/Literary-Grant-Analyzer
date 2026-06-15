import { LegalForm } from "@prisma/client";

export type OrganizationDto = {
    id: number,
    name: string,
    legalForm: LegalForm,
    address: string | null,
    foundingYear: number | null,
    createdAt: Date,
    updatedAt: Date | null,
};

export type CreateOrganizationDto = {
    name: string,
    legalForm: LegalForm,
    address?: string,
    foundingYear?: number,
};

export type UpdateOrganizationDto = {
    name?: string,
    legalForm?: LegalForm,
    address?: string,
    foundingYear?: number,
};