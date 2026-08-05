import { AwardSchemeType, FundingArea } from "@prisma/client";
import { RelationalEntityBlueprint } from "../../data-import/types/import.types";
import { importAwardSchemeSchema } from "../../award-scheme/validation/award-scheme.schema";

export const awardSchemeBlueprint: RelationalEntityBlueprint = 
    {
        entity: 'awardScheme',
        fields: [
            {
                name: 'name',
                type: 'string',
                required: true,
            },
            {
                name: 'type',
                type: 'enum',
                required: true,
                options: Object.keys(AwardSchemeType),
            },
            {
                name: 'organizationName',
                type: 'string',
                required: true
            },
            {
                name: 'fundingArea',
                type: 'enum',
                required: true,
                options: Object.keys(FundingArea),
            }
        ],
        schema: importAwardSchemeSchema,
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