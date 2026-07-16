import { AwardDecision } from "@prisma/client";
import { CreateAwardDecisionDto, UpdateAwardDecisionDto } from "./dto/award-decision.dto";
import { AwardDecisionRepository } from "./award-decision.repository";
import { CrudService } from "../../common/services/crud.service";

export class AwardDecisionService extends CrudService<AwardDecision, CreateAwardDecisionDto, UpdateAwardDecisionDto>
{
    constructor(
        repository: AwardDecisionRepository
    ) {
        super(repository);
    }
}