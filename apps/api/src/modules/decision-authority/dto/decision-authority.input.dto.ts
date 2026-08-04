import z from "zod";
import { 
    createDecisionAuthorityInputSchema, 
    createDecisionAuthoritySchema, 
    updateDecisionAuthoritySchema,
} from "../validation/decision-authority.schema";

export type CreateDecisionAuthorityInput = z.infer<typeof createDecisionAuthorityInputSchema>;
export type CreateDecisionAuthorityWithActorIdInput = z.infer<typeof createDecisionAuthoritySchema>;

export type UpdateDecisionAuthorityInput = z.infer<typeof updateDecisionAuthoritySchema>;