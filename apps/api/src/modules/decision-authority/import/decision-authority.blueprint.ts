import { RelationalModelBlueprint } from "../../data-import/types/import.types";
import { importDecisionAuthoritySchema } from "../validation/decision-authority.schema";

export const decisionAuthorityBlueprint: RelationalModelBlueprint = 
    {
        model: 'decisionAuthority',
        fields: [
            {
                name: 'name',
                type: 'string',
                required: true,
            },
            {
                name: 'organizationName',
                type: 'string',
                required: false
            },
        ],
        schema: importDecisionAuthoritySchema,
        relations: [
            {
                model: 'organization',
                lookup: {
                    sourceField: 'organizationName',
                    lookupField: 'name',
                },
                foreignKey: 'organizationId',
                targetField: 'id',
            },
        ],
    };