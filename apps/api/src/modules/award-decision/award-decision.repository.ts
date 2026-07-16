import { AwardDecisionWithRelations } from "./types/award-decision.types";
import { prisma } from "../../db/prisma";

export class AwardDecisionRepository
{
    async findAllWithActors(): Promise<AwardDecisionWithRelations[]>
    {
        return prisma.awardDecision.findMany({
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

    async findByIdWithActors(id: number): Promise<AwardDecisionWithRelations | null>
    {
        return prisma.awardDecision.findUnique({
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