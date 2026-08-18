import z from "zod";
import { organizationSortableFieldSchema } from "../validation/organization.schema";

export type OrganizationSortableField = z.infer<typeof organizationSortableFieldSchema>;