import { Id, ListQueryParams } from "../../common/types/types";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { Database } from "../../db/types";
import { AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionRepository
{
    constructor(
        private readonly entity: Database['awardDecision'],
        private readonly listQueryBuilder?: ListDbQueryBuilder
    ) {}

    async findAllWithRelatedData(query?: ListQueryParams): Promise<AwardDecisionEntityWithRelatedData[]>
    {
        return this.entity.findMany({
            include: {
                decisionMaker: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        decisionAuthority: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                },
                recipient: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        decisionAuthority: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                sourceDocument: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                awardScheme: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            ...this.listQueryBuilder?.build(query)
        });
    }

    async findByIdWithRelatedData(id: Id): Promise<AwardDecisionEntityWithRelatedData | null>
    {
        return this.entity.findUnique({
            where: { id },
            include: {
                decisionMaker: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        decisionAuthority: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                },
                recipient: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        decisionAuthority: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                },
                sourceDocument: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                awardScheme: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
        });
    }
}