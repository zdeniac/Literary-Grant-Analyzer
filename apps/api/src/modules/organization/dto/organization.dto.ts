import { LegalForm } from "@prisma/client";

export type OrganizationDto = {
    id: number,
    name: string,
    legalForm: LegalForm,
    address: string | null,
    foundingDate: Date | null,
    createdAt: Date,
    updatedAt: Date | null,
};

export type CreateOrganizationDto = {
    name: string,
    legalForm: LegalForm,
    address?: string,
    foundingDate?: Date,
};

export type UpdateOrganizationDto = {
    name?: string,
    legalForm?: LegalForm,
    address?: string,
    foundingDate?: Date,
};