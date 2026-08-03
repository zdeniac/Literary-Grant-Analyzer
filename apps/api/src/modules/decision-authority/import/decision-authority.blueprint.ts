import { RelationalModelBlueprint } from "../../data-import/types/import.types";
import {importDecisionBodySchema } from "../validation/decision-body.schema";

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
        schema: importDecisionBodySchema,
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