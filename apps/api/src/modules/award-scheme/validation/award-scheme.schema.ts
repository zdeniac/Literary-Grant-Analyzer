import * as z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { AwardSchemeType, FundingArea } from "@prisma/client";
import { organizationSchema } from "../../organization/validation/organization.schema";

export const awardSchemeSortableFieldSchema = z.enum([
    'id',
    'name',
    'type',
    'fundingArea',
    'createdAt',
    'updatedAt',
]);

export const awardSchemeSchema = z.object({
    id: idSchema,

    name: nameSchema,
    type: z.enum(AwardSchemeType),
    fundingArea: z.enum(FundingArea),

    organizationId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

const ommittedFields = {
    id: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const createAwardSchemeSchema = awardSchemeSchema
    .omit(ommittedFields);

export const updateAwardSchemeSchema = awardSchemeSchema
    .omit(ommittedFields)
    .partial();

export const importAwardSchemeSchema = awardSchemeSchema
    .omit({
        id: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        organizationName: organizationSchema.shape.name,
    });