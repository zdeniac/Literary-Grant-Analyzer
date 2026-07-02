import { DecisionBody } from "@prisma/client";
import { DtoMapper } from "../../../common/types/types";
import { DecisionBodyDto } from "../dto/decision-body.dto";

export const toDecisionBodyDto: DtoMapper<DecisionBody, DecisionBodyDto> = (
    decisionBody
) => ({
    id: decisionBody.id,
    
    name: decisionBody.name,
    
    organizationId: decisionBody.organizationId,

    createdAt: decisionBody.createdAt,
    updatedAt: decisionBody.updatedAt,
});