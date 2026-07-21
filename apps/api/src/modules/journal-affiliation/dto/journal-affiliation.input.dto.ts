import z from "zod";
import { createJournalAffiliationSchema, updateJournalAffiliationSchema } from "../validate/journal-affiliation.schema";

export type CreateJournalAffiliationInput = z.infer<typeof createJournalAffiliationSchema>;
export type UpdateJournalAffiliationInput = z.infer<typeof updateJournalAffiliationSchema>;