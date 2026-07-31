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

                sourceField: 'recipientName',
                lookupField: 'name',

                foreignKey: 'recipientId',
                targetField: 'actorId',
            },
            {
                model: 'awardScheme',

                sourceField: 'awardSchemeName',
                lookupField: 'name',

                foreignKey: 'awardSchemeId',
                targetField: 'id',
            },
            {
                model: ['decisionBody', 'organization'],
                
                sourceField: 'decisionMakerName',
                lookupField: 'name',

                foreignKey: 'decisionMakerId',
                targetField: 'actorId',
            },
        ],
    };