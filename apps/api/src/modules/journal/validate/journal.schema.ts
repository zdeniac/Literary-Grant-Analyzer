import { JournalFormat, JournalStatus } from "@prisma/client";
import z from "zod";
import { organizationSchema } from "../../organization/validation/organization.schema";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";
import { createJournalAffiliationSchema, journalAffiliationSchema, journalAffiliationWithOrganizationAndSourceDocumentSchema } from "../../journal-affiliation/validate/journal-affiliation.schema";

const ommittedFields = {
    id: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const issnSchema = z
    .string()
    .transform(v => v.replace('-', ''))
    .refine(v => /^\d{8}$/.test(v) || /^\d{7}X$/.test(v));

export const journalSchema = z.object({
    id: idSchema,

    name: nameSchema,
    issn: issnSchema.nullable(),
    foundingYear: yearSchema.nullable(),
    status: z.enum(JournalStatus).default(JournalStatus.ACTIVE),
    format: z.array(z.enum(JournalFormat)).min(1),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const journalWithAffiliationsSchema = journalSchema
    .extend({
        affiliations: z.array(journalAffiliationWithOrganizationAndSourceDocumentSchema),
    });

export const createJournalSchema = journalSchema
    .omit(ommittedFields)
    .extend({   
        issn: issnSchema.nullable().optional(),
        foundingYear: yearSchema.nullable().optional(),
    });

export const createJournalWithAffiliationsSchema = createJournalSchema
    .extend({
        affiliations: z.array(createJournalAffiliationSchema),
    });

export const updateJournalWithAffiliationsSchema = journalSchema
    .omit(ommittedFields)
    .partial();

export const importJournalSchema = createJournalSchema
    .extend({
        organizationName: organizationSchema.shape.name,
    });
