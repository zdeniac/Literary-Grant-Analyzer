import { DtoMapper } from "../../../common/types/types";
import { DecisionAuthorityDto, DecisionAuthorityEntity } from "../dto/decision-authority.dto";

export const toDecisionAuthorityDto: DtoMapper<DecisionAuthorityEntity, DecisionAuthorityDto> = (
    decisionAuthority
) => ({
    id: decisionAuthority.id,
    
    name: decisionAuthority.name,
    
    organizationId: decisionAuthority.organizationId,
    actorId: decisionAuthority.actorId,

    createdAt: decisionAuthority.createdAt,
    updatedAt: decisionAuthority.updatedAt,
});