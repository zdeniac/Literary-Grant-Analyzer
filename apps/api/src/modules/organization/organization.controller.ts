import { NotFoundError } from "../../common/error/http.error";
import { CreateOrganizationDto, OrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { OrganizationService } from "./organization.service";

export class OrganizationController {
    constructor(private service: OrganizationService) {}

    async create(dto: CreateOrganizationDto): Promise<OrganizationDto> {
        const org = await this.service.create(dto)
        return toOrganizationDto(org);
    }

    async update(id: number, dto: UpdateOrganizationDto): Promise<OrganizationDto> {
        const org = await this.service.update(id, dto);
        return toOrganizationDto(org);
    }

    async find(id: number): Promise<OrganizationDto> {
        const org = await this.service.findById(id);

        if (org === null) throw new NotFoundError();

        return toOrganizationDto(org);
    }

    async findAll(): Promise<OrganizationDto[]> {
        return (await this.service.findAll())
            .map(toOrganizationDto);
    }

    async delete(id: number): Promise<void> {
        await this.service.delete(id)
    }
}