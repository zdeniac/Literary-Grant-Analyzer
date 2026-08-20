import z from "zod";
import { decisionAuthoritySearchableFieldSchema, decisionAuthoritySortableFieldSchema } from "../validation/decision-authority.schema";

export type DecisionAuthoritySortableField = z.infer<typeof decisionAuthoritySortableFieldSchema>;
export type DecisionAuthoritySearchableField = z.infer<typeof decisionAuthoritySearchableFieldSchema>;