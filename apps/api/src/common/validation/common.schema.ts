import * as z from "zod";

export const idSchema = z.coerce.number().int().positive();

export type IdParam = z.infer<typeof idSchema>;