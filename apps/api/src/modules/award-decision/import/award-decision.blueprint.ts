import { RelationalEntityImportBlueprint } from "../../data-import/types/import-blueprint.types";
import { importAwardDecisionSchema } from "../validation/award-decision.schema";

export const awardDecisionBlueprint: RelationalEntityImportBlueprint = 
    {
        entity: 'awardDecision',
        fields: [
            {
                name: 'recipientNameVariants',
                type: 'string',
                required: true
            },
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
            {
                name: 'sourceDocumentUrl',
                type: 'string',
                required: true,
            }
        ],
        schema: importAwardDecisionSchema,
        relations: [
            {
                entity: 'organization',

                foreignKey: 'recipientId',
                targetField: 'actorId',

                lookup: {
                    sourceField: 'recipientNameVariants',
                    lookupField: 'nameVariants',
                },
            },
            {
                entity: 'organization',

                foreignKey: 'recipientId',
                targetField: 'actorId',

                lookup: {
                    sourceField: 'recipientName',
                    lookupField: 'name',
                },
            },
            {
                entity: 'awardScheme',

                foreignKey: 'awardSchemeId',
                targetField: 'id',

                lookup: [
                    {
                        sourceField: 'awardSchemeName',
                        lookupField: 'name',
                    },
                    {
                        foreignEntity: 'organization',
                        foreignKey: 'organizationId',

                        sourceField: 'awardSchemeOrganizationName',
                        lookupField: 'name',
                    }
                ],
            },
            {
                entity: ['decisionAuthority', 'organization'],

                foreignKey: 'decisionMakerId',
                targetField: 'actorId',

                lookup: {
                    sourceField: 'decisionMakerName',
                    lookupField: 'name',
                },
            },
            {
                entity: 'sourceDocument',

                foreignKey: 'sourceDocumentId',
                targetField: 'id',

                lookup: {
                    sourceField: 'sourceDocumentUrl',
                    lookupField: 'url',
                }
            },
        ],
    };