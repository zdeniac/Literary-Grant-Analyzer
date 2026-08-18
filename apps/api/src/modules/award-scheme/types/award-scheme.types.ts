import z from "zod";
import { awardSchemeSortableFieldSchema } from "../validation/award-scheme.schema";

export type AwardSchemeSortableField = z.infer<typeof awardSchemeSortableFieldSchema>