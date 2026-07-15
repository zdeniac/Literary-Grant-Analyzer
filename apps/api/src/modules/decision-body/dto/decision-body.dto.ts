import z from "zod";
import { Id, Name } from "../../../common/types/types";
import { DecisionBodySchema } from "../validation/decision-body.schema";

export type DecisionBodyDto = {
    id: Id;
    name: Name;
    organizationId: Id | null;

    createdAt: Date;
    updatedAt: Date | null;
};

export type CreateDecisionBodyDto = z.infer<typeof DecisionBodySchema>;

export type CreateDecisionBodyData = CreateDecisionBodyDto & {
    actorId: Id;
};

export type UpdateDecisionBodyDto = {
    name?: Name;
    organizationId?: Id;
};