import * as z from "zod";

export const idSchema = z.coerce.number().int().positive();

export const yearSchema = z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear());