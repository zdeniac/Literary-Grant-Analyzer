import z from "zod";
import { createOrganizationSchema, createOrganizationWithActorIdSchema, updateOrganizationSchema } from "../validation/organization.schema";

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateOrganizationInputWithActorId = z.infer<typeof createOrganizationWithActorIdSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;