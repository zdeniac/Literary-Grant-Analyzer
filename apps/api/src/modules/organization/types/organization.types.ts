import z from "zod";
import { organizationSearchableFieldSchema, organizationSortableFieldSchema } from "../validation/organization.schema";

export type OrganizationSortableField = z.infer<typeof organizationSortableFieldSchema>;
export type OrganizationSearchableField = z.infer<typeof organizationSearchableFieldSchema>;