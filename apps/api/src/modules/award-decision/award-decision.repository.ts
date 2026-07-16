import { AwardDecision } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateAwardDecisionDto, UpdateAwardDecisionDto } from "./dto/award-decision.dto";

export class AwardDecisionRepository
    extends PrismaCrudRepository<AwardDecision, CreateAwardDecisionDto, UpdateAwardDecisionDto> 
{
    protected get model(): PrismaModel<AwardDecision>
    {
        return this.db.awardDecision
    }
}