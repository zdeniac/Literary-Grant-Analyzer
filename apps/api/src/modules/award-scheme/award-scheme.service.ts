import { AwardScheme } from "@prisma/client";
import { CreateAwardSchemeDto, UpdateAwardSchemeDto } from "./dto/award-scheme.dto";
import { AwardSchemeRepository } from "./award-scheme.repository";
import { CrudService } from "../../common/services/crud.service";

export class AwardSchemeService extends CrudService<AwardScheme, CreateAwardSchemeDto, UpdateAwardSchemeDto> {
    constructor(
        repository: AwardSchemeRepository
    ) {
        super(repository);
    }
}