import { AwardDecision, Prisma } from "@prisma/client";

export type AwardDecisionWithActors = AwardDecision & {
    decisionMaker: {
        organization: { name: string } | null;
        decisionBody: { name: string } | null;
    };
    recipient: {
        organization: { name: string } | null;
        decisionBody: { name: string } | null;
    };
};

export type AwardDecisionWithRelations = Prisma.AwardDecisionGetPayload<{
    include: {
        decisionMaker: {
            include: {
                organization: true;
                decisionBody: true;
            };
        };
        recipient: {
            include: {
                organization: true;
                decisionBody: true;
            };
        };
    };
}>;
