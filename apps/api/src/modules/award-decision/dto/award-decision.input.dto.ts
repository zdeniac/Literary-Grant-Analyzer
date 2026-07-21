import z from "zod";
import { createAwardDecisionSchema, updateAwardDecisionSchema } from "../validation/award-decision.schema";

export type CreateAwardDecisionInput = z.infer<typeof createAwardDecisionSchema>;
export type UpdateAwardDecisionInput = z.infer<typeof updateAwardDecisionSchema>;