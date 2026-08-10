import { ActorType } from "../../../../../packages/shared/enums";
import { Id } from "../../../common/types/types";

export type RecipientDto = {
    id: Id;
    name: string;
    type: ActorType.ORGANIZATION | ActorType.PERSON;
};

export type DecisionMakerDto = {
    id: Id;
    name: string;
    type: ActorType.DECISION_AUTHORITY | ActorType.ORGANIZATION
};