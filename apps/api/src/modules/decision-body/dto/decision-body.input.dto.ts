import z from "zod";
import { 
    createDecisionBodyInputSchema, 
    createDecisionBodySchema, 
    updateDecisionBodySchema,
} from "../validation/decision-body.schema";

export type CreateDecisionBodyInput = z.infer<typeof createDecisionBodyInputSchema>;
export type CreateDecisionBodyData = z.infer<typeof createDecisionBodySchema>;

export type UpdateDecisionBodyInput = z.infer<typeof updateDecisionBodySchema>;