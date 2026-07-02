import z from "zod";
import { Id } from "../../../common/types/types";
import { DecisionBodySchema } from "../validation/decision-body.schema";

export type DecisionBodyDto = {
    id: Id;
    name: string;
    organizationId: Id | null;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateDecisionBodyDto = z.infer<typeof DecisionBodySchema>;

export type UpdateDecisionBodyDto = {
    name?: string;
    organizationId?: Id;
};