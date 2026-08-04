import { RelationalModelBlueprint } from "../../data-import/types/import.types";
import { importAwardDecisionSchema } from "../validation/award-decision.schema";

export const awardDecisionBlueprint: RelationalModelBlueprint = 
    {
        model: 'awardDecision',
        fields: [
            {
                name: 'recipientName',
                type: 'string',
                required: true
            },
            {
                name: 'awardSchemeName',
                type: 'string',
                required: true
            },
            {
                name: 'awardSchemeOrganizationName',
                type: 'string',
                required: true,
            },
            {
                name: 'decisionMakerName',
                type: 'string',
                required: true,
            },
            {
                name: 'amount',
                type: 'number',
                required: true,
            },
            {
                name: 'purpose',
                type: 'string',
                required: false,
            },
            {
                name: 'sourceIdentifier',
                type: 'string',
                required: false,
            },
        ],
        schema: importAwardDecisionSchema,
        relations: [
            {
                model: 'organization',

                foreignKey: 'recipientId',
                targetField: 'actorId',

                lookup: {
                    sourceField: 'recipientName',
                    lookupField: 'name',
                },
            },
            {
                model: 'awardScheme',

                foreignKey: 'awardSchemeId',
                targetField: 'id',

                lookup: [
                    {
                        sourceField: 'awardSchemeName',
                        lookupField: 'name',
                    },
                    {
                        foreignModel: 'organization',
                        foreignKey: 'organizationId',

                        sourceField: 'awardSchemeOrganizationName',
                        lookupField: 'name',
                    }
                ],
            },
            {
                model: ['decisionAuthority', 'organization'],

                foreignKey: 'decisionMakerId',
                targetField: 'actorId',

                lookup: {
                    sourceField: 'decisionMakerName',
                    lookupField: 'name',
                },
            },
        ],
    };