import { ListDbQueryOptions, SearchQueryBuilderInterface } from "../../../db/types";

export class OrganizationSearchQueryBuilder implements SearchQueryBuilderInterface
{
    build(keyword: string, fields: string[]): ListDbQueryOptions
    {
        const OR = fields.map(field => {
            switch (field) {
                case 'nameVariants':
                    return {
                        nameVariants: {
                            has: keyword,
                        },
                    };

                default:
                    return {
                        [field]: {
                            contains: keyword,
                            mode: 'insensitive',
                        },
                    };
            }
        });

        return {
            where: {
                OR,
            },
        };
    }
}