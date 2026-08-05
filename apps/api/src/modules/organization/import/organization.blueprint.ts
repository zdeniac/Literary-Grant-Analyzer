import { LegalForm, Sector } from "@prisma/client";
import { importOrganizationSchema } from "../../organization/validation/organization.schema";
import { EntityBlueprint } from "../../data-import/types/import.types";

export const organizationBlueprint: EntityBlueprint = 
    {
        entity: 'organization',
        fields: [
            {
                name: 'name',
                type: 'string',
                required: true,
            },
            {
                name: 'website',
                type: 'string',
                required: false,
            },
            {
                name: 'legalForm',
                type: 'enum',
                required: true,
                options: Object.values(LegalForm),
            },
            {
                name: 'sector',
                type: 'enum',
                required: true,
                options: Object.values(Sector),
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
        schema: importOrganizationSchema,
    };
