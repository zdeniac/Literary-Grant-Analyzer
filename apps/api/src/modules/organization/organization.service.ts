import { Organization } from "@prisma/client";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto/organization.dto";
import { OrganizationRepository } from "./organization.repository";
import { CrudService } from "../../common/services/crud.service";

export class OrganizationService extends CrudService<Organization, CreateOrganizationDto, UpdateOrganizationDto> {
    constructor(
        repository: OrganizationRepository
    ) {
        super(repository);
    }
}