import { prisma } from "../../db/prisma";
import { Organization } from "@prisma/client";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";
import { NotFoundError } from "../../common/error/http.error";
import { IdParam } from "../../common/validation/common.schema";

export class OrganizationService {
    public async create(dto: CreateOrganizationDto): Promise<Organization>
    {
        return prisma.organization.create({
            data: dto,
        });
    }

    public async findById(id: IdParam): Promise<Organization> 
    {
        const org: Organization | null = await prisma.organization.findUnique({
            where: {
                id,
            },
        });

        if (!org) throw new NotFoundError();

        return org;
    }

    public async findAll(): Promise<Organization[]>
    {
        return prisma.organization.findMany();
    }

    public async update(id: IdParam, dto: UpdateOrganizationDto): Promise<Organization>
    {
        return prisma.organization.update({
            where: { 
                id 
            },
            data: dto,
        });
    }

    public async delete(id: IdParam): Promise<Organization>
    {
        return prisma.organization.delete({
            where: { 
                id 
            },
        });
    }
}