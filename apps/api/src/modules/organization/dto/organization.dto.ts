import z from "zod";
import { organizationSchema } from "../validation/organization.schema";

export type OrganizationModel = OrganizationDto;
export type OrganizationDto = z.infer<typeof organizationSchema>;
