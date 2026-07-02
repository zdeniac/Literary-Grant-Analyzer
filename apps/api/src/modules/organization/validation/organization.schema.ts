import { LegalForm } from "@prisma/client";
import * as z from "zod";
import { nameSchema, yearSchema } from "../../../common/validation/schema";

export const OrganizationSchema = z.object({
    name: nameSchema,
    legalForm: z.enum(LegalForm),
    address: z.optional(z.string().min(4).max(70)),
    foundingYear: yearSchema.optional(),
});

export const ImportOrganizationSchema = OrganizationSchema.extend({
    foundingYear: z.coerce.number().optional(),
});
