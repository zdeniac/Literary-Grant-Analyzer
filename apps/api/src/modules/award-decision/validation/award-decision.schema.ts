import * as z from "zod";
import { idSchema } from "../../../common/validation/schema";
import { Prisma } from "@prisma/client";

const decimalSchema = z.custom<Prisma.Decimal>();

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