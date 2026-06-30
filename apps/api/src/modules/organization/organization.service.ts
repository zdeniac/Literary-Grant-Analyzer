import { Organization } from "@prisma/client";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";
import { IdParam } from "../../common/types/types";
import { OrganizationRepository } from "./organization.repository";

export class OrganizationService {
    constructor(
        private readonly repository: OrganizationRepository
    ) {}

    public async create(dto: CreateOrganizationDto): Promise<Organization>
    {
        return this.repository.create(dto);
    }

    public async findById(id: IdParam): Promise<Organization> 
    {
        return this.repository.findByIdOrThrow(id);
    }

    public async findAll(): Promise<Organization[]>
    {
        return this.repository.findAll();
    }

    public async update(id: IdParam, dto: UpdateOrganizationDto): Promise<Organization>
    {
        return this.repository.update(id, dto)
    }

    public async delete(id: IdParam): Promise<void>
    {
        return this.repository.delete(id)
    }
}