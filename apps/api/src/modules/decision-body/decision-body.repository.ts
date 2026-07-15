import { DecisionBody } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { CreateDecisionBodyData, CreateDecisionBodyDto, UpdateDecisionBodyDto } from "./dto/decision-body.dto";
import { PrismaModel } from "../../db/types";

export class DecisionBodyRepository 
    extends PrismaCrudRepository<DecisionBody, CreateDecisionBodyDto, UpdateDecisionBodyDto> 
{
    protected get model(): PrismaModel<DecisionBody>
    {
        return this.db.decisionBody;
    }

    async createMany(data: CreateDecisionBodyData[]): Promise<number>
    {
        const result = await this.model.createMany({ data });

        return result.count;
    }
}