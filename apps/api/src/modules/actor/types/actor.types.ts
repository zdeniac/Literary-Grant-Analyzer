import { Prisma } from "@prisma/client";

export type RecipientActorEntityWithRelatedData = Prisma.ActorGetPayload<{
    include: {
        organization: {
            select: {
                name: true,
            },
        },
        person: {
            select: {
                name: true,
            },
        },
    },
}>;

export type DecisionMakerActorEntityWithRelatedData = Prisma.ActorGetPayload<{
    include: {
        organization: {
            select: {
                name: true,
            },
        },
        decisionAuthority: {
            select: {
                name: true,
            },
        },
    },
}>;