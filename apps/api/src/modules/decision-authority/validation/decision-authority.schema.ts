import z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { organizationSchema } from "../../organization/validation/organization.schema";

const ommittedFields = {
    id: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const decisionAuthoritySortableFieldSchema = z.enum([
    'id',
    'name',
    'createdAt',
    'updatedAt',
]);

export const decisionAuthoritySchema = z.object({
    id: idSchema,

    name: nameSchema,
    organizationId: idSchema,
    actorId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createDecisionAuthorityInputSchema = decisionAuthoritySchema
    .omit(ommittedFields)
    .extend({
        actorId: idSchema.nullable().optional(),
    });

export const createDecisionAuthoritySchema = decisionAuthoritySchema
    .omit(ommittedFields);

export const updateDecisionAuthoritySchema = decisionAuthoritySchema
    .omit(ommittedFields)
    .partial()
;

export const importDecisionAuthoritySchema = decisionAuthoritySchema
    .partial()
    .extend({
        organizationName: organizationSchema.shape.name,
    });