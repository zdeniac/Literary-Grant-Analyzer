import z from "zod";
import { decisionAuthoritySortableFieldSchema } from "../validation/decision-authority.schema";

export type DecisionAuthoritySortableField = z.infer<typeof decisionAuthoritySortableFieldSchema>