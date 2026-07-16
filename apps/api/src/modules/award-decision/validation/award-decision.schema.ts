import * as z from "zod";
import { idSchema } from "../../../common/validation/schema";

const awardDecisionBaseSchema = z.object({
    awardSchemeId: idSchema,
    decisionMakerId: idSchema,
    recipientId: idSchema,
    sourceDocumentId: idSchema,

    amount: z.number().positive().nullable(),
    purpose: z.string().nullable(),
    sourceIdentifier: z.string().nullable(),
    decisionDate: z.coerce.date(),
});

export const CreateAwardDecisionSchema = awardDecisionBaseSchema.extend({
    amount: z.number().positive().nullable().optional(),
    purpose: z.string().nullable().optional(),
    sourceIdentifier: z.string().nullable().optional(),
});

export const UpdateAwardDecisionSchema = awardDecisionBaseSchema.partial();