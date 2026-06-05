import { LegalForm } from "@prisma/client";
import * as z from "zod";

const maxStrLen = 60;

export const createOrganizationSchema = z.strictObject({
    name: z.string().min(1).max(maxStrLen),
    legalForm: z.enum(LegalForm),
    address: z.optional(z.string().min(4).max(maxStrLen)),
    foundingDate: z.optional(z.date()).safeParse(new Date()),
});
