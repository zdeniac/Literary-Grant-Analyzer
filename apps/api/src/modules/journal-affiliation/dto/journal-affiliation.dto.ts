import z from "zod";
import { journalAffiliationSchema } from "../validate/journal-affiliation.schema";

export type JournalAffiliationEntity = JournalAffiliationDto;
export type JournalAffiliationDto = z.infer<typeof journalAffiliationSchema>;