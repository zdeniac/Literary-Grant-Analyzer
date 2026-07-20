import { JournalFormat, JournalStatus } from "@prisma/client";
import z from "zod";
import { OrganizationSchema } from "../../organization/validation/organization.schema";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";
import { CreateJournalOrganizationSchema, JournalOrganizationSchema } from "../../journal-organization/validate/journal-organization.schema";

export const issnSchema = z
    .string()
    .transform(v => v.replace('-', ''))
    .refine(v => /^\d{8}$/.test(v) || /^\d{7}X$/.test(v));

const JournalBaseSchema = z.object({
    name: nameSchema,
    issn: issnSchema.nullable().optional(),
    foundingYear: yearSchema.nullable().optional(),
    status: z.enum(JournalStatus).default(JournalStatus.ACTIVE),
    format: z.array(z.enum(JournalFormat)).min(1),
});

export const CreateJournalSchemaWithOrganizations = JournalBaseSchema.extend({
    organizations: z.array(CreateJournalOrganizationSchema),
});

export const UpdateJournalSchemaWithOrganizations = JournalBaseSchema
    .partial()
    .extend({
        id: idSchema,
        pivot: z.array(JournalOrganizationSchema),
    });

export const ImportJournalSchema = JournalBaseSchema.extend({
    foundingYear: yearSchema.nullable().optional(),
    organizationName: OrganizationSchema.shape.name,
});
