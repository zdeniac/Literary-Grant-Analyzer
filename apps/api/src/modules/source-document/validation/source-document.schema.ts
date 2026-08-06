import * as z from "zod";
import { idSchema } from "../../../common/validation/schema";

export const sourceDocumentSchema = z.object({
    id: idSchema,

    title: z.string().trim().min(1),
    url: z.httpUrl(),
    retrievedAt: z.coerce.date(),

    issuingOrganizationId: idSchema.nullable().default(null),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createSourceDocumentSchema = sourceDocumentSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })

export const updateSourceDocumentSchema = createSourceDocumentSchema.partial();