import z from "zod";
import { 
    createDecisionAuthorityInputSchema, 
    createDecisionBodySchema, 
    updateDecisionBodySchema,
} from "../validation/decision-authority.schema";

export type CreateDecisionAuthorityInput = z.infer<typeof createDecisionAuthorityInputSchema>;
export type CreateDecisionAuthorityData = z.infer<typeof createDecisionBodySchema>;

export type UpdateDecisionAuthorityInput = z.infer<typeof updateDecisionBodySchema>;