import z from "zod";
import { createJournalAffiliationInputSchema, createJournalAffiliationSchema, updateJournalAffiliationSchema } from "../validate/journal-affiliation.schema";

export type CreateJournalAffiliationInput = z.infer<typeof createJournalAffiliationSchema>;
export type CreateNestedJournalAffiliationInput = z.infer<typeof createJournalAffiliationInputSchema>

export type UpdateJournalAffiliationInput = z.infer<typeof updateJournalAffiliationSchema>;