import z from "zod";
import { 
    createJournalAffiliationForNewJournalSchema, 
    createJournalAffiliationSchema, 
    updateJournalAffiliationSchema, 
    updateJournalAffiliationWithIdSchema
} from "../validate/journal-affiliation.schema";

export type CreateJournalAffiliationInput = z.infer<typeof createJournalAffiliationSchema>;
export type CreateNestedJournalAffiliationInput = z.infer<typeof createJournalAffiliationForNewJournalSchema>

export type UpdateJournalAffiliationInput = z.infer<typeof updateJournalAffiliationSchema>;
export type UpdateJournalAffiliationWithIdInput = z.infer<typeof updateJournalAffiliationWithIdSchema>