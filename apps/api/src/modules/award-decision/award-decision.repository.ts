import { Id } from "../../common/types/types";
import { Database } from "../../db/types";
import { AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionRepository
{
    constructor(
        private readonly entity: Database['awardDecision']
    ) {}

    async findAllWithRelatedData(): Promise<AwardDecisionEntityWithRelatedData[]>
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