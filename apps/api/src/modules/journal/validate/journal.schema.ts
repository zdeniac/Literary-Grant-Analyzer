import { JournalStatus } from "@prisma/client";
import z from "zod";
import { OrganizationSchema } from "../../organization/validation/organization.schema";

export const issnSchema = z
    .string()
    .transform(v => v.replace('-', ''))
    .refine(v => /^\d{8}$/.test(v) || /^\d{7}X$/.test(v));

const JournalBaseSchema = z.object({
    name: z.string().trim().min(1).max(60),
    issn: issnSchema.nullable().optional(),
    foundingYear: z.number().optional(),
    status: z.enum(JournalStatus).optional(),
});

export const JournalSchema = JournalBaseSchema.extend({
    organizationId: z.int().positive(),
});

export const ImportJournalSchema = JournalBaseSchema.extend({
    foundingYear: z.coerce.number().optional(),
    organizationName: OrganizationSchema.shape.name,
});
