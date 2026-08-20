import z from "zod";
import { awardSchemeSearchableFieldSchema, awardSchemeSortableFieldSchema } from "../validation/award-scheme.schema";

export type AwardSchemeSortableField = z.infer<typeof awardSchemeSortableFieldSchema>;
export type AwardSchemeSearchableField = z.infer<typeof awardSchemeSearchableFieldSchema>;