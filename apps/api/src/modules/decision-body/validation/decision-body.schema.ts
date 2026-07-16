import z from "zod";
import { idSchema, nameSchema } from "../../../common/validation/schema";
import { OrganizationSchema } from "../../organization/validation/organization.schema";

const DecisionBodyBaseSchema = z.object({
    name: nameSchema,
});

export const DecisionBodySchema = DecisionBodyBaseSchema.extend({
    organizationId: idSchema,
});

export const UpdateDecisionBodySchema = DecisionBodySchema.partial();

export const ImportDecisionBodySchema = DecisionBodyBaseSchema.extend({
    organizationName: OrganizationSchema.shape.name,
});