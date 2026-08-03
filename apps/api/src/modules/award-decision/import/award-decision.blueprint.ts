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
                lookup: {
                    sourceField: 'recipientName',
                    lookupField: 'name',
                },
                foreignKey: 'recipientId',
                targetField: 'actorId',
            },
            {
                model: 'awardScheme',
                lookup: [
                    {
                        sourceField: 'awardSchemeName',
                        lookupField: 'name',
                    },
                    {
                        sourceField: 'awardSchemeOrganizationName',
                        lookupField: 'name',
                        model: 'organization',
                        foreignKey: 'organizationId',
                    }
                ],
                foreignKey: 'awardSchemeId',
                targetField: 'id',
            },
            {
                model: ['decisionAuthority', 'organization'],
                lookup: {
                    sourceField: 'decisionMakerName',
                    lookupField: 'name',
                },
                foreignKey: 'decisionMakerId',
                targetField: 'actorId',
            },
        ],
    };