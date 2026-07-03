import * as z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { AwardSchemeType } from "@prisma/client";

export const AwardSchemeSchema = z.object({
    name: nameSchema,
    type: z.enum(AwardSchemeType),
    organizationId: idSchema,
});