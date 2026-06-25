import { LegalForm } from "@prisma/client";
import { OrganizationSchema } from "../../organization/validation/organization.schema";
import { ModelBlueprint } from "../types/data-import.types";

export const organizationBlueprint: ModelBlueprint = 
    {
        fields: [
            {
                name: 'name',
                type: 'string',
                required: true,
            },
            {
                name: 'legalForm',
                type: 'enum',
                required: true,
                options: Object.values(LegalForm),
            },
            {
                name: 'address',
                type: 'string',
                required: false,
            },
            {
                name: 'foundingYear',
                type: 'number',
                required: false,
            }

        ],
        schema: OrganizationSchema,
    };
