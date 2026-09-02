import { LegalForm, Sector } from "@prisma/client";
import * as z from "zod";
import { idSchema, nameSchema, yearSchema } from "../../../common/validation/schema";
import { validSearchableFields, validSortableFields } from "../../../../../packages/shared/constants";

export const organizationSortableFieldSchema = z.enum(validSortableFields.organization);
export const organizationSearchableFieldSchema = z.enum(validSearchableFields.organization);

export const organizationSchema = z.object({
    id: idSchema,

    name: nameSchema,
    nameVariants: z.array(nameSchema),
    
    legalForm: z.enum(LegalForm),
    sector: z.enum(Sector),
    
    address: z.string().min(4).max(256).nullable(),
    website: z.httpUrl().nullable(),

    foundingYear: z.preprocess(
        value => value === '' || value === null || value === 0 || value === undefined ? null : value,
        yearSchema.nullable()
    ),

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
        nameVariants: z.preprocess(
            value => value === '' || value === null ? undefined : value,
            z.array(nameSchema).optional()
        ),
    });

export const createOrganizationWithActorIdSchema = createOrganizationSchema
    .extend({
        actorId: idSchema,
    });

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const importOrganizationNameVariantsSchema = z.string().transform(value =>  value.split('|'));

export const importOrganizationSchema = createOrganizationSchema
    .extend({
        foundingYear: z.preprocess(
            value => value === '' || value === null || value === 0 ? undefined : value,
            yearSchema.optional()
        ),
        nameVariants: importOrganizationNameVariantsSchema.optional()
    });

