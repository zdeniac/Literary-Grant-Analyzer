import { ListDbQueryOptions, SearchQueryBuilderInterface } from "../types";

export class SearchQueryBuilder implements SearchQueryBuilderInterface
{
    build(keyword: string, fields: string[]): ListDbQueryOptions
    {
        return {
            where: {
                OR: fields.map(field => ({
                    [field]: {
                        contains: keyword,
                        mode: 'insensitive',
                    },
                })),
            },
        };
    }
}