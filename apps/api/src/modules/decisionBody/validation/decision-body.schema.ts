import z from "zod";
import { idSchema } from "../../../common/validation/schema";
import { OrganizationSchema } from "../../organization/validation/organization.schema";

const DecisionBodyBaseSchema = z.object({
    name: z.string().trim().min(1).max(60),
});

export const DecisionBodySchema = DecisionBodyBaseSchema.extend({
    organizationId: idSchema,
});

export const ImportDecisionBodySchema = DecisionBodyBaseSchema.extend({
    organizationName: OrganizationSchema.shape.name,
});