import * as z from "zod";

export const SourceDocumentSchema = z.object({
    title: z.string().trim().min(1),
    url: z.httpUrl(),
    retrievedAt: z.date(),
});