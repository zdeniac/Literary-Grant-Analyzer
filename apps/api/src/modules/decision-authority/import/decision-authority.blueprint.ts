import { RelationalEntityBlueprint } from "../../data-import/types/import.types";
import { importDecisionAuthoritySchema } from "../validation/decision-authority.schema";

export const decisionAuthorityBlueprint: RelationalEntityBlueprint = 
    {
        entity: 'decisionAuthority',
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
                entity: 'organization',
                lookup: {
                    sourceField: 'organizationName',
                    lookupField: 'name',
                },
                foreignKey: 'organizationId',
                targetField: 'id',
            },
        ],
    };