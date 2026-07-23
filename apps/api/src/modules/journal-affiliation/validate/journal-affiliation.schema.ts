import z from "zod";
import { idSchema, yearSchema } from "../../../common/validation/schema";

export const journalAffiliationSchema = z.object({
    id: idSchema,

    fromYear: yearSchema.nullable(),
    toYear: yearSchema.nullable(),
    note: z.string().nullable(),
    isCurrent: z.boolean(),

    sourceDocumentId: idSchema.nullable(),
    journalId: idSchema,
    organizationId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const journalAffiliationWithOrganizationAndSourceDocumentSchema = journalAffiliationSchema
    .extend({
        organizationName: z.string(),
        sourceDocumentTitle: z.string().nullable(),
    });

// journalId is optional when creating a new affiliation, because it will be set by the JournalService
export const createJournalAffiliationSchema = journalAffiliationSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        fromYear: yearSchema.nullable().optional(),
        toYear: yearSchema.nullable().optional(),
        note: z.string().nullable().optional(),
        isCurrent: z.boolean().default(true).optional(),

        journalId: idSchema.optional(),

        sourceDocumentId: idSchema.nullable().optional(),
    });

// The affiliation cannot be attached to a different journal
export const updateJournalAffiliationSchema = journalAffiliationSchema
    .omit({
        id: true,
        journalId: true,
    })
    .partial();