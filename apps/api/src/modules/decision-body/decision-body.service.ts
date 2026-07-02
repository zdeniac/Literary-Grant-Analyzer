import { DecisionBody } from "@prisma/client";
import { IdParam } from "../../common/types/types";
import { DecisionBodyRepository } from "./decision-body.repository";
import { CreateDecisionBodyDto, UpdateDecisionBodyDto } from "./dto/decision-body.dto";
import { CrudService } from "../../common/services/crud.service";

export class DecisionBodyService extends CrudService<DecisionBody, CreateDecisionBodyDto, UpdateDecisionBodyDto> {
    constructor(
        repository: DecisionBodyRepository
    ) {
        super(repository);
    }
}