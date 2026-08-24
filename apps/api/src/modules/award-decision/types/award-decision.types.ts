import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import z from "zod";
import { awardDecisionSearchableFieldSchema, awardDecisionSortableFieldSchema } from "../validation/award-decision.schema";

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
            select: {
                type: true,
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
            select: {
                type: true,
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

export type AwardDecisionSortableField = z.infer<typeof awardDecisionSortableFieldSchema>;
export type AwardDecisionSearchableField = z.infer<typeof awardDecisionSearchableFieldSchema>;