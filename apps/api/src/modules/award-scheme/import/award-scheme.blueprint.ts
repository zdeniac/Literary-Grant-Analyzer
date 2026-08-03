import { AwardSchemeType, FundingArea } from "@prisma/client";
import { RelationalModelBlueprint } from "../../data-import/types/import.types";
import { importAwardSchemeSchema } from "../../award-scheme/validation/award-scheme.schema";

export const awardSchemeBlueprint: RelationalModelBlueprint = 
    {
        model: 'awardScheme',
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