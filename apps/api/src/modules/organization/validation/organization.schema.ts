import { LegalForm } from "@prisma/client";
import * as z from "zod";
import { nameSchema, yearSchema } from "../../../common/validation/schema";

export const OrganizationSchema = z.object({
    name: nameSchema,

    legalForm: z.enum(LegalForm),

    address: z.preprocess(
        value => value === '' || value === null ? undefined : value,
        z.string().min(4).max(70).optional()
    ),

    website: z.preprocess(
        value => value === '' || value === null ? undefined : value,
        z.httpUrl().optional()
    ),

    foundingYear: yearSchema.optional(),
});

export const UpdateOrganizationSchema = OrganizationSchema.partial();

export const ImportOrganizationSchema = OrganizationSchema.extend({
    foundingYear: z.coerce.number().optional(),
});