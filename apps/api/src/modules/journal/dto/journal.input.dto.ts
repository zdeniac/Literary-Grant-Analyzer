import z from "zod";
import { 
    createJournalSchema, 
    createJournalWithAffiliationsSchema, 
    createJournalWithOrganizationIdsSchema, 
    updateJournalWithAffiliationsSchema 
} from "../validate/journal.schema";

export type CreateJournalWithAffiliationsInput = z.infer<typeof createJournalWithAffiliationsSchema>;
export type CreateJournalInput = z.infer<typeof createJournalSchema>;

export type ImportJournalWithOrganizationIdsInput = z.infer<typeof createJournalWithOrganizationIdsSchema>;

export type UpdateJournalWithAffiliationsInput = z.infer<typeof updateJournalWithAffiliationsSchema>;
