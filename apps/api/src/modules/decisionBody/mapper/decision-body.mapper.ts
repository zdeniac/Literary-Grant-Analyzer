import { DecisionBody } from "@prisma/client";
import { Mapper } from "../../../common/types/types";
import { DecisionBodyDto } from "../dto/decision-body.dto";

export const toDecisionBodyDto: Mapper<DecisionBody, DecisionBodyDto> = (
    decisionBody
) => ({
    id: decisionBody.id,
    
    name: decisionBody.name,
    
    organizationId: decisionBody.organizationId,

    createdAt: decisionBody.createdAt,
    updatedAt: decisionBody.updatedAt,
});