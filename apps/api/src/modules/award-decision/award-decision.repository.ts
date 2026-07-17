import { PrismaDatabase } from "../../db/types";
import { AwardDecisionWithActors } from "./types/award-decision.types";

export class AwardDecisionRepository
{
    constructor(
        private readonly model: PrismaDatabase['awardDecision']
    ) {}

    async findAllWithActors(): Promise<AwardDecisionWithActors[]>
    {
        return this.model.findMany({
            include: {
                decisionMaker: {
                    include: {
                        organization: true,
                        decisionBody: true,
                    },
                },
                recipient: {
                    include: {
                        organization: true,
                        decisionBody: true,
                    },
                },
            },
        });
    }

    async findByIdWithActors(id: number): Promise<AwardDecisionWithActors | null>
    {
        return this.model.findUnique({
            where: { id },
            include: {
                decisionMaker: {
                    include: {
                        organization: true,
                        decisionBody: true,
                    },
                },
                recipient: {
                    include: {
                        organization: true,
                        decisionBody: true,
                    },
                },
            },
        });
    }
}