import z from "zod";
import { 
    createJournalSchema, 
    createJournalWithAffiliationsSchema, 
    createJournalWithOrganizationIdSchema, 
    updateJournalWithAffiliationsSchema 
} from "../validate/journal.schema";

export type CreateJournalWithAffiliationsInput = z.infer<typeof createJournalWithAffiliationsSchema>;
export type CreateJournalWithOrganizationIdInput = z.infer<typeof createJournalWithOrganizationIdSchema>;
export type CreateJournalInput = z.infer<typeof createJournalSchema>;

export type UpdateJournalWithAffiliationsInput = z.infer<typeof updateJournalWithAffiliationsSchema>;

