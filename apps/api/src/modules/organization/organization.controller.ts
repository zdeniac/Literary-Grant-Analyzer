import { OrganizationService } from "./organization.service";
import { CrudController } from "../../common/contollers/crud.controller";
import { OrganizationDto } from "./dto/organization.dto";
import { DtoMapper } from "../../common/types/types";
import { Organization } from "@prisma/client";

export class OrganizationController extends CrudController<Organization, OrganizationDto> {
    constructor(
        service: OrganizationService,
        mapper: DtoMapper<Organization, OrganizationDto>
    ) {
        super(service, mapper);
    }
}