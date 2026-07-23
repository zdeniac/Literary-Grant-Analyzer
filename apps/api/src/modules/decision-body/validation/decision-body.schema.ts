import z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { organizationSchema } from "../../organization/validation/organization.schema";

const ommittedFields = {
    id: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const decisionBodySchema = z.object({
    id: idSchema,

    name: nameSchema,
    organizationId: idSchema,
    actorId: idSchema,

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createDecisionBodyInputSchema = decisionBodySchema
    .omit(ommittedFields)
    .extend({
        actorId: idSchema.nullable().optional(),
    });

export const createDecisionBodySchema = decisionBodySchema
    .omit(ommittedFields);

export const updateDecisionBodySchema = decisionBodySchema
    .omit(ommittedFields)
    .partial()
;

export const importDecisionBodySchema = decisionBodySchema
    .partial()
    .extend({
        organizationName: organizationSchema.shape.name,
    });