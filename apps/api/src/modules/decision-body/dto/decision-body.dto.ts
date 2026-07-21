import z from "zod";
import { decisionBodySchema } from "../validation/decision-body.schema";

export type DecisionBodyModel = DecisionBodyDto;
export type DecisionBodyDto = z.infer<typeof decisionBodySchema>;
