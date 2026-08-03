import z from "zod";
import { 
    journalSchema, 
    journalWithAffiliationsSchema, 
    journalWithOrganizationsSchema 
} from "../validate/journal.schema";

export type JournalModel = JournalDto;

export type JournalWithAffiliationsDto = z.infer<typeof journalWithAffiliationsSchema>;
export type JournalDto = z.infer<typeof journalSchema>;

export type JournalListDto = z.infer<typeof journalWithOrganizationsSchema>;