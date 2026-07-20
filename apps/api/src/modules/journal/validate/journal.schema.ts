import { JournalFormat, JournalStatus } from "@prisma/client";
import z from "zod";
import { OrganizationSchema } from "../../organization/validation/organization.schema";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";

export const issnSchema = z
    .string()
    .transform(v => v.replace('-', ''))
    .refine(v => /^\d{8}$/.test(v) || /^\d{7}X$/.test(v));

const JournalBaseSchema = z.object({
    name: nameSchema,
    issn: issnSchema.nullable().optional(),
    foundingYear: yearSchema.nullable().optional(),
    status: z.enum(JournalStatus).optional(),
    format: z.array(z.enum(JournalFormat)).min(1),
});

export const JournalSchema = JournalBaseSchema.extend({
    organizationId: idSchema,
});

export const UpdateJournalSchema = JournalSchema.partial();

export const ImportJournalSchema = JournalBaseSchema.extend({
    foundingYear: yearSchema.nullable().optional(),
    organizationName: OrganizationSchema.shape.name,
});
