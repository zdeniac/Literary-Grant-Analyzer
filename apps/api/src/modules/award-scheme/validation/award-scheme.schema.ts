import * as z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { AwardSchemeType } from "@prisma/client";
import { OrganizationSchema } from "../../organization/validation/organization.schema";

const BaseAwardSchemeSchema = z.object({
    name: nameSchema,
    type: z.enum(AwardSchemeType),
});

export const AwardSchemeSchema = BaseAwardSchemeSchema.extend({
    organizationId: idSchema,
});

export const UpdateAwardSchemeSchema = AwardSchemeSchema.partial();

export const ImportAwardSchemeSchema = BaseAwardSchemeSchema.extend({
    organizationName: OrganizationSchema.shape.name,
});