import { RelationalEntityImportBlueprint } from "../../data-import/types/import-blueprint.types";
import { importDecisionAuthoritySchema } from "../validation/decision-authority.schema";

export const decisionAuthorityBlueprint: RelationalEntityImportBlueprint = 
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