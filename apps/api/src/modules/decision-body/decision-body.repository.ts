import { DecisionBody } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateDecisionBodyDto, UpdateDecisionBodyDto } from "./dto/decision-body.dto";

export class DecisionBodyRepository extends PrismaCrudRepository<DecisionBody, CreateDecisionBodyDto, UpdateDecisionBodyDto> {
    constructor(model: PrismaModel<DecisionBody>) {
        super(model);
    }
}