import { DecisionBody } from "@prisma/client";
import { CrudController } from "../../common/contollers/crud.controller";
import { DecisionBodyDto } from "./dto/decision-body.dto";
import { Mapper } from "../../common/types/types";
import { DecisionBodyService } from "./decision-body.service";

export class DecisionBodyController extends CrudController<DecisionBody, DecisionBodyDto> {
    constructor(
        service: DecisionBodyService,
        mapper: Mapper<DecisionBody, DecisionBodyDto>
    ) {
        super(service, mapper);
    }
}