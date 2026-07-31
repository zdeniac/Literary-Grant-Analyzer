import { Prisma } from "@prisma/client";
import * as z from "zod";

export const idSchema = z.coerce.number().int().positive();

export const decimalSchema = z.custom<Prisma.Decimal>();

export const nameSchema = z.string().trim().min(1);

export const yearSchema = z
    .coerce
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear());

