import { ListDbQueryOptions, SearchQueryBuilderInterface } from "../../../db/types";

export class AwardDecisionSearchQueryBuilder implements SearchQueryBuilderInterface
{
    build(keyword: string, fields: string[]): ListDbQueryOptions
    {
        const OR = fields.map(field => {
            switch (field) {
                case 'decisionMakerName':
                    return {
                        decisionMaker: {
                            OR: [
                                {
                                    organization: {
                                        name: {
                                            contains: keyword,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                                {
                                    decisionAuthority: {
                                        name: {
                                            contains: keyword,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                            ],
                        },
                    };
                case 'recipientName':
                    return {
                        recipient: {
                            OR: [
                                {
                                    organization: {
                                        name: {
                                            contains: keyword,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                                {
                                    person: {
                                        OR: [
                                            {
                                            firstName: {
                                                contains: keyword,
                                                mode: 'insensitive',
                                            },
                                            lastName: {
                                                contains: keyword,
                                                mode: 'insensitive',
                                            },
                                        }
                                        ]
                                    },
                                },
                            ],
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