import * as z from "zod";
import { decimalSchema, idSchema, nameSchema } from "../../../common/validation/schema";
import { awardSchemeSchema } from "../../award-scheme/validation/award-scheme.schema";
import { organizationSchema } from "../../organization/validation/organization.schema";
import { decisionBodySchema } from "../../decision-body/validation/decision-body.schema";

export const awardDecisionSchema = z.object({
    id: idSchema,

    awardSchemeId: idSchema,
    decisionMakerId: idSchema,
    recipientId: idSchema,
    sourceDocumentId: idSchema,

    amount: decimalSchema.nullable(),
    purpose: z.string().nullable(),
    sourceIdentifier: z.string().nullable(),
    decisionDate: z.coerce.date(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const awardDecisionWithActorsSchema = awardDecisionSchema.extend({
    decisionMakerName: z.string(),
    decisionMakerId: idSchema,
    
    recipientId: idSchema,
    recipientName: z.string(),
});

export const createAwardDecisionSchema = awardDecisionSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        amount: z.number().positive().nullable().optional(),
        purpose: z.string().nullable().optional(),
        sourceIdentifier: z.string().nullable().optional(),
    });

export const updateAwardDecisionSchema = awardDecisionSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .partial();


export const importAwardDecisionSchema = z.object({
    recipientName: organizationSchema.shape.name,
    awardSchemeName: awardSchemeSchema.shape.name,
    decisionMakerName: z.union([
        organizationSchema.shape.name,
        decisionBodySchema.shape.name
    ]),

    amount: awardDecisionSchema.shape.amount,
    purpose: z.string().optional(),
    sourceIdentifier: z.string().optional(),

    sourceDocumentId: idSchema,

    decisionDate: z.coerce.date(),
});