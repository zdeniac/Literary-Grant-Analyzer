import { DtoMapper } from "../../../common/types/types";
import { RecipientDto } from "../dto/ actor.dto";
import { RecipientActorEntityWithRelatedData } from "../types/actor.types";

export const toRecipientDto: DtoMapper<RecipientActorEntityWithRelatedData, RecipientDto> = (entity) => {
    const name = entity.organization?.name ?? entity.person?.name;

    if (!name) {
        throw new Error(`Recipient actor ${entity.id} has no recipient name.`);
    }

    return {
        id: entity.id,
        name,
        type: entity.type
    }
};  