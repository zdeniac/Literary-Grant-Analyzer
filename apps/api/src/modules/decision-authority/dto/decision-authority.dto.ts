import z from "zod";
import { decisionAuthoritySchema } from "../validation/decision-authority.schema";

export type DecisionAuthorityEntity = DecisionAuthorityDto;
export type DecisionAuthorityDto = z.infer<typeof decisionAuthoritySchema>;
