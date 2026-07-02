import { AwardScheme } from "@prisma/client";
import { CrudController } from "../../common/contollers/crud.controller";
import { AwardSchemeDto } from "./dto/award-scheme.dto";
import { AwardSchemeService } from "./award-scheme.service";
import { DtoMapper } from "../../common/types/types";

export class AwardSchemeController extends CrudController<AwardScheme, AwardSchemeDto>
{
    constructor(
        service: AwardSchemeService,
        mapper: DtoMapper<AwardScheme, AwardSchemeDto>
    ) {
        super(service, mapper);
    }
}