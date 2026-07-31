import { JournalFormat, JournalStatus } from "@prisma/client";
import z from "zod";
import { organizationSchema } from "../../organization/validation/organization.schema";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";
import { 
    createJournalAffiliationForNewJournalSchema,
    createJournalAffiliationSchema, 
    journalAffiliationSchema, 
    journalAffiliationWithOrganizationAndSourceDocumentSchema,
    updateJournalAffiliationSchema, 
} from "../../journal-affiliation/validate/journal-affiliation.schema";

const ommittedFields = {
    id: true,
    createdAt: true,
    updatedAt: true,
} as const;

const importFormatSchema = z
    .string()
    .transform(value =>
        value.split('|').map(v => v.trim()) as JournalFormat[]
    )
    .pipe(
        z.array(z.enum(JournalFormat)).min(1)
    );

export const organizationNamesSchema = z
    .string()
    .transform(value =>
        value
            .split('|')
            .map(v => v.trim())
    )
    .pipe(
        z.array(organizationSchema.shape.name)
    );

export const issnSchema = z
    .string()
    .transform(v => v.trim() === '' ? null : v.replace('-', ''))
    .refine(v => v === null || /^\d{8}$/.test(v) || /^\d{7}X$/.test(v));
    
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

export const journalWithOrganizationsSchema = journalSchema
    .extend({
        organizations: z.array(
            z.object({
                id: idSchema,
                name: organizationSchema.shape.name,
            })
        )
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

export const createJournalWithOrganizationIdsSchema = createJournalSchema
    .extend({
        organizationIds: z.array(idSchema),
    });

export const createJournalWithAffiliationsSchema = createJournalSchema
    .extend({
        affiliations: z
            .array(createJournalAffiliationForNewJournalSchema)
            .min(1, 'At least one affiliation is required'),
    });

// When updating a journal, we expect that it already has at least one affiliation,
// so we use the full journalAffiliationSchema
export const updateJournalWithAffiliationsSchema = createJournalSchema
    .extend({
        affiliations: z.array(
            z.union([
                updateJournalAffiliationSchema,
                createJournalAffiliationSchema
            ])
        ),
    })
    .partial();

export const importJournalSchema = createJournalSchema
    .extend({
        foundingYear: z.coerce.number(),
        format: importFormatSchema,
        organizationNames: organizationNamesSchema,
    });
