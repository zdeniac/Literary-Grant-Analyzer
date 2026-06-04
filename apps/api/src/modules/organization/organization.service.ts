import { prisma } from "../../db/prisma";
import { Organization, LegalForm } from "@prisma/client";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";

export class OrganizationService {
    async create(dto: CreateOrganizationDto): Promise<Organization> {
        return prisma.organization.create({
            data: dto,
        });
    }

    async findById(id: number): Promise<Organization | null> {
        return prisma.organization.findUnique({
            where: {
                id,
            },
        });
    }

    async findAll(): Promise<Organization[]> {
        return prisma.organization.findMany();
    }

    async update(id: number, dto: UpdateOrganizationDto): Promise<Organization> {
        return prisma.organization.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number): Promise<Organization> {
        return prisma.organization.delete({
            where: { id },
        });
    }
}