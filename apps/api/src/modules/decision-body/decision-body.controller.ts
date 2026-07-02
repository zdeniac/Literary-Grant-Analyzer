import { DecisionBody } from "@prisma/client";
import { CrudController } from "../../common/contollers/crud.controller";
import { DecisionBodyDto } from "./dto/decision-body.dto";
import { DtoMapper } from "../../common/types/types";
import { DecisionBodyService } from "./decision-body.service";

export class DecisionBodyController extends CrudController<DecisionBody, DecisionBodyDto> {
    constructor(
        service: DecisionBodyService,
        mapper: DtoMapper<DecisionBody, DecisionBodyDto>
    ) {
        super(service, mapper);
    }
}