import { RelationalModelBlueprint } from "../../data-import/types/import.types";
import { ImportDecisionBodySchema } from "../validation/decision-body.schema";

export const decisionBodyBlueprint: RelationalModelBlueprint = 
    {
        model: 'decisionBody',
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
        schema: ImportDecisionBodySchema,
        relations: [
            {
                model: 'organization',

                sourceField: 'organizationName',
                lookupField: 'name',

                foreignKey: 'organizationId',
                targetField: 'id',
            },
        ],
    };