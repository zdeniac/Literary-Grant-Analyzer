import z from "zod";
import { createJournalWithAffiliationsSchema, updateJournalWithAffiliationsSchema } from "../validate/journal.schema";

export type CreateJournalWithAffiliationsInput = z.infer<typeof createJournalWithAffiliationsSchema>;
export type UpdateJournalWithAffiliationsInput = z.infer<typeof updateJournalWithAffiliationsSchema>;