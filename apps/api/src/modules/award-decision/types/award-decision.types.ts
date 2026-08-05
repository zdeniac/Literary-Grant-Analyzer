import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export type AwardDecisionEntity = {
    id: number;

    amount: Decimal | null;
    purpose: string | null;

    sourceIdentifier: string | null;
    decisionDate: Date;

    awardSchemeId: number;
    decisionMakerId: number;
    recipientId: number;
    sourceDocumentId: number;

    createdAt: Date;
    updatedAt: Date;
};

export type AwardDecisionEntityWithActors = Prisma.AwardDecisionGetPayload<{
    include: {
        decisionMaker: {
            include: {
                organization: true;
                decisionAuthority: true;
            };
        };
        recipient: {
            include: {
                organization: true;
                decisionAuthority: true;
            };
        };
    };
}>;
