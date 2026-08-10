import z from "zod";
import { awardDecisionSchema, awardDecisionWithRelatedDataSchema } from "../validation/award-decision.schema";

export type AwardDecisionDto = z.infer<typeof awardDecisionSchema>;
export type AwardDecisionWithRelatedDataDto = z.infer<typeof awardDecisionWithRelatedDataSchema>;