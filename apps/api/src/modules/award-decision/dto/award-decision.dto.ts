import z from "zod";
import { awardDecisionSchema, awardDecisionWithActorsSchema } from "../validation/award-decision.schema";

export type AwardDecisionDto = z.infer<typeof awardDecisionSchema>;
export type AwardDecisionWithActorsDto = z.infer<typeof awardDecisionWithActorsSchema>;