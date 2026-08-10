import { DtoMapper } from "../../../common/types/types";
import { DecisionMakerDto } from "../dto/ actor.dto";
import { DecisionMakerActorEntityWithRelatedData } from "../types/actor.types";

export const toDecisionMakerDto: DtoMapper<DecisionMakerActorEntityWithRelatedData, DecisionMakerDto> = (entity) => {
    const name = entity.organization?.name ?? entity.decisionAuthority?.name;

    if (!name) {
        throw new Error(`Actor ${entity.id} has no recipient name.`);
    }

    return {
        id: entity.id,
        name: name,
        type: entity.type
    }
}