import * as z from "zod";

export const idSchema = z.coerce.number().int().positive();

export const nameSchema = z.string().trim().min(1).max(70);

export const yearSchema = z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear());
