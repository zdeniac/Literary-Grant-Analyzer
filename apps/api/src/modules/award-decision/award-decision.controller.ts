import { AwardDecision } from "@prisma/client";
import { CrudController } from "../../common/controllers/crud.controller";
import { AwardDecisionDto } from "./dto/award-decision.dto";
import { AwardDecisionService } from "./award-decision.service";
import { DtoMapper } from "../../common/types/types";

export class AwardDecisionController extends CrudController<AwardDecision, AwardDecisionDto>
{
    constructor(
        service: AwardDecisionService,
        mapper: DtoMapper<AwardDecision, AwardDecisionDto>
    ) {
        super(service, mapper);
    }
}