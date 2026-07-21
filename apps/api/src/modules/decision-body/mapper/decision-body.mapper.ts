import { DtoMapper } from "../../../common/types/types";
import { DecisionBodyDto, DecisionBodyModel } from "../dto/decision-body.dto";

export const toDecisionBodyDto: DtoMapper<DecisionBodyModel, DecisionBodyDto> = (
    decisionBody
) => ({
    id: decisionBody.id,
    
    name: decisionBody.name,
    
    organizationId: decisionBody.organizationId,
    actorId: decisionBody.actorId,

    createdAt: decisionBody.createdAt,
    updatedAt: decisionBody.updatedAt,
});