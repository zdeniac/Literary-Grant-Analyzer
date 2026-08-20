import { ListDbQueryOptions } from "../types";

export class SearchQueryBuilder
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