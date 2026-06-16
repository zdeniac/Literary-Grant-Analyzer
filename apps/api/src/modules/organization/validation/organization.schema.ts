import { LegalForm } from "@prisma/client";
import * as z from "zod";

const maxStrLen = 60;

export const organizationSchema = z.object({
    name: z.string().min(1).max(maxStrLen),
    legalForm: z.enum(LegalForm),
    address: z.optional(z.string().min(4).max(maxStrLen)),
    foundingYear: z.number().optional(),
});
