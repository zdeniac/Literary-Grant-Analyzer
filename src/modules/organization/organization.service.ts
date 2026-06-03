import { prisma } from "../../db/prisma";
import { Organization, LegalForm } from "@prisma/client";

export class OrganizationService {
    async create(name: string, legalForm: LegalForm, address?: string, foundingDate?: Date): Promise<Organization> {
        return prisma.organization.create({
            data: {
                name,
                address,
                legalForm,
                foundingDate
            },
        });
    }

    async findById(id: number): Promise<Organization|null> {
        return prisma.organization.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll(): Promise<Organization[]> {
        return prisma.organization.findMany();
    }

    async update(id: number, data: { name?: string, legalForm?: LegalForm, address?: string, foundingDate?: Date }): Promise<Organization> {
        return prisma.organization.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Organization> {
        return prisma.organization.delete({
            where: { id },
        });
    }
}