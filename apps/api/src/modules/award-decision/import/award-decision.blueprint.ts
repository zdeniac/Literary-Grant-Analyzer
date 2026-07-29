import { RelationalModelBlueprint } from "../../data-import/types/import.types";

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
        // schema: ,
        relations: [
            {
                model: 'organization',

                sourceField: 'recipientName',
                lookupField: 'name',

                foreignKey: 'recipientId',
                targetField: 'id',
            },
            {
                model: 'awardScheme',

                sourceField: 'awardSchemeName',
                lookupField: 'name',

                foreignKey: 'awardSchemeId',
                targetField: 'id',
            },
            {
                model: 'decisionBody',
                
                sourceField: 'decisionMakerName',
                lookupField: 'name',

                foreignKey: 'decisionMakerId',
                targetField: 'id',
            }
        ],
    };