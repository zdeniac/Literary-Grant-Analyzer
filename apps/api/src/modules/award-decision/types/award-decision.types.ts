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

export type AwardDecisionEntityWithRelatedData = Prisma.AwardDecisionGetPayload<{
    include: {
        decisionMaker: {
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                };
                decisionAuthority: {
                    select: {
                        id: true,
                        name: true,
                    },
                };
            };
        };
        recipient: {
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                };
                decisionAuthority: {
                    select: {
                        id: true,
                        name: true,
                    },
                };
            };
        };
        awardScheme: {
            select: {
                id: true,
                name: true,
            },
        };
        sourceDocument: {
            select: {
                id: true,
                title: true,
            },
        };
    };
}>;
