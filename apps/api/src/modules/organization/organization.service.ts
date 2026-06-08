import { prisma } from "../../db/prisma";
import { Organization } from "@prisma/client";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";
import { NotFoundError } from "../../common/error/http.error";
import { IdParam } from "../../common/validation/common.schema";

export class OrganizationService {
    async create(dto: CreateOrganizationDto): Promise<Organization> {
        return prisma.organization.create({
            data: dto,
        });
    }

    async findById(id: IdParam): Promise<Organization> {
        const org: Organization | null = await prisma.organization.findUnique({
            where: {
                id,
            },
        });

        if (!org) throw new NotFoundError();

        return org;
    }

    async findAll(): Promise<Organization[]> {
        return prisma.organization.findMany();
    }

    async update(id: IdParam, dto: UpdateOrganizationDto): Promise<Organization> {
        return prisma.organization.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: IdParam): Promise<Organization> {
        return prisma.organization.delete({
            where: { id },
        });
    }
}