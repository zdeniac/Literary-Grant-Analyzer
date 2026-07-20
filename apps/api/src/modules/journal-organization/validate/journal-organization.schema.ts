import z from "zod";
import { idSchema, yearSchema } from "../../../common/validation/schema";

export const JournalOrganizationSchema = z.object({
    id: idSchema,

    fromYear: yearSchema.nullable().optional(),
    toYear: yearSchema.nullable().optional(),
    note: z.string().nullable().optional(),

    sourceDocumentId: idSchema.nullable().optional(),
    
    journalId: idSchema,
    organizationId: idSchema,
});

export const CreateJournalOrganizationSchema = JournalOrganizationSchema
    .omit({
        id: true,
    });

export const UpdateJournalOrganizationSchema = JournalOrganizationSchema
    .omit({
        id: true,
        journalId: true,
        organizationId: true,
    });