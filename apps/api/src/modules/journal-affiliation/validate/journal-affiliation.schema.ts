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

const journalAffiliationCreateInputSchema = z.object({
    organizationId: idSchema,

    fromYear: yearSchema.nullable().optional(),
    toYear: yearSchema.nullable().optional(),

    note: z.string().nullable().optional(),

    isCurrent: z.boolean().default(true),

    sourceDocumentId: idSchema.nullable().optional(),
});

/**
 * Used when creating a Journal with affiliations.
 * The journalId is assigned by the JournalService.
 */
export const createJournalAffiliationForNewJournalSchema = journalAffiliationCreateInputSchema;

/**
 * Used when creating an affiliation for an existing Journal.
 */
export const createJournalAffiliationForExistingJournalSchema = journalAffiliationCreateInputSchema
    .extend({
        journalId: idSchema.optional()
    });

/**
 * Only the affiliation metadata can be updated.
 * The Journal and Organization cannot be changed.
 */
export const updateJournalAffiliationSchema = journalAffiliationSchema
    .omit({
        journalId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        id: true,
    })
    .partial();

export const updateJournalAffiliationWithIdSchema = journalAffiliationSchema
    .omit({
        journalId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
    })
    .partial()
    .extend({
        id: idSchema,
    });