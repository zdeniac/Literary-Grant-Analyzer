import { LegalForm } from "@prisma/client";
import * as z from "zod";

const maxStrLen = 60;

export const OrganizationSchema = z.object({
    name: z.string().trim().min(1).max(maxStrLen),
    legalForm: z.enum(LegalForm),
    address: z.optional(z.string().min(4).max(maxStrLen)),
    foundingYear: z.number().optional(),
});

export const ImportOrganizationSchema = OrganizationSchema.extend({
    foundingYear: z.coerce.number().optional(),
});
