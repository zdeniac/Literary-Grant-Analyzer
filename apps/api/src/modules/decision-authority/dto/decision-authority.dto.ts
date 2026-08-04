import z from "zod";
import { decisionAuthoritySchema } from "../validation/decision-authority.schema";

export type DecisionAuthorityModel = DecisionAuthorityDto;
export type DecisionAuthorityDto = z.infer<typeof decisionAuthoritySchema>;
