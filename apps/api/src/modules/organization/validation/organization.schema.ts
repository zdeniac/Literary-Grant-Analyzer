import { LegalForm, Sector } from "@prisma/client";
import * as z from "zod";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";

export const organizationSchema = z.object({
    id: idSchema,

    name: nameSchema,
    legalForm: z.enum(LegalForm),
    sector: z.enum(Sector),
    
    address: z.string().min(4).max(256).nullable(),
    website: z.httpUrl().nullable(),
    foundingYear: yearSchema.nullable(),

    actorId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createOrganizationSchema = organizationSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        actorId: true,
    })
    .extend({
        address: z.preprocess(
            value => value === '' || value === null ? undefined : value,
            z.string().min(4).max(256).optional()
        ),
        website: z.preprocess(
            value => value === '' || value === null ? undefined : value,
            z.httpUrl().optional()
        ),
        foundingYear: yearSchema.optional(),
    });

export const createOrganizationWithActorIdSchema = createOrganizationSchema
    .extend({
        actorId: idSchema,
    });

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const importOrganizationSchema = createOrganizationSchema
    .extend({
        foundingYear: z.preprocess(
            value => value === '' ? undefined : value,
            yearSchema.optional()
        ),
    });