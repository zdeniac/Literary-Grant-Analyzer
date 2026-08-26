import { DtoMapper } from "../../../common/types/types";
import { DecisionMakerDto } from "../dto/ actor.dto";
import { DecisionMakerActorEntityWithRelatedData } from "../types/actor.types";

export const toDecisionMakerDto: DtoMapper<DecisionMakerActorEntityWithRelatedData, DecisionMakerDto> = (entity) => {
    const name = entity.organization?.name ?? entity.decisionAuthority?.name;

    if (!name) {
        throw new Error(`Decision maker actor ${entity.id} has no name or actor id.`);
    }

    return {
        id: entity.id,
        name,
        type: entity.type
    }
}