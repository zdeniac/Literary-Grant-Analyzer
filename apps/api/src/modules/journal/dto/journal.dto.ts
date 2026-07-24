import z from "zod";
import { journalSchema, journalWithAffiliationsSchema } from "../validate/journal.schema";

export type JournalModel = JournalDto;

export type JournalWithAffiliationsDto = z.infer<typeof journalWithAffiliationsSchema>;
export type JournalDto = z.infer<typeof journalSchema>;