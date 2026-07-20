import z from "zod";
import { CreateJournalOrganizationSchema, UpdateJournalOrganizationSchema } from "../validate/journal-organization.schema";

export type JournalOrganizationDto = z.infer<typeof CreateJournalOrganizationSchema>;
export type CreateJournalOrganizationInput = JournalOrganizationDto;
export type UpdateJournalOrganizationInput = z.infer<typeof UpdateJournalOrganizationSchema>;