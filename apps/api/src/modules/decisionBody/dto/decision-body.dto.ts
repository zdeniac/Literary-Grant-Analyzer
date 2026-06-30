import { Id } from "../../../common/types/types";

export type DecisionBodyDto = {
    id: Id;
    
    name: string;
    
    organizationId: Id | null;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateDecisionBodyDto = {};

export type UpdateDecisionBodyDto = {};