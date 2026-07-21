import z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { organizationSchema } from "../../organization/validation/organization.schema";

export const decisionBodySchema = z.object({
    id: idSchema,

    name: nameSchema,
    organizationId: idSchema.optional().nullable(),
    actorId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

const ommittedFields = {
    id: true,
    actorId: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const createDecisionBodyInputSchema = decisionBodySchema
    .omit(ommittedFields)
    .extend({
        organizationId: idSchema,
    });

export const createDecisionBodySchema = decisionBodySchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        organizationId: idSchema,
    });

export const updateDecisionBodySchema = decisionBodySchema
    .omit(ommittedFields)
    .partial()
;

export const importDecisionBodySchema = decisionBodySchema
    .partial()
    .extend({
        organizationName: organizationSchema.shape.name,
    });