import z from "zod";
import { decisionBodySchema } from "../validation/decision-body.schema";

export type DecisionAuthorityModel = DecisionAuthorityDto;
export type DecisionAuthorityDto = z.infer<typeof decisionBodySchema>;
