import { Id } from "../../common/types/types";
import { Database } from "../../db/types";
import { AwardDecisionEntityWithActors } from "./types/award-decision.types";

export class AwardDecisionRepository
{
    constructor(
        private readonly entity: Database['awardDecision']
    ) {}

    async findAllWithActors(): Promise<AwardDecisionEntityWithActors[]>
    {
        return this.entity.findMany({
            include: {
                decisionMaker: {
                    include: {
                        organization: true,
                        decisionAuthority: true,
                    },
                },
                recipient: {
                    include: {
                        organization: true,
                        decisionAuthority: true,
                    },
                },
            },
        });
    }

    async findByIdWithActors(id: Id): Promise<AwardDecisionEntityWithActors | null>
    {
        return this.entity.findUnique({
            where: { id },
            include: {
                decisionMaker: {
                    include: {
                        organization: true,
                        decisionAuthority: true,
                    },
                },
                recipient: {
                    include: {
                        organization: true,
                        decisionAuthority: true,
                    },
                },
            },
        });
    }
}