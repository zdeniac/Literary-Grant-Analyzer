import { JournalStatus } from "@prisma/client";
import z from "zod";

const maxStrLen = 60;

const issnSchema = z
    .string()
    .transform(v => v.replace("-", ""))
    .refine(v => /^\d{8}$/.test(v) || /^\d{7}X$/.test(v));

export const JournalSchema = z.object({
    name: z.string().min(1).max(maxStrLen),
    issn: issnSchema.nullable().optional(),
    foundingYear: z.number().optional(),
    status: z.enum(JournalStatus),
    organizationId: z.int().positive(),
});