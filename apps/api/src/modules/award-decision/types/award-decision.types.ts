import { Prisma } from "@prisma/client";

export type AwardDecisionWithActors = Prisma.AwardDecisionGetPayload<{
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
