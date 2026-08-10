import { Prisma } from "@prisma/client";

export type RecipientActorEntityWithRelatedData = Prisma.ActorGetPayload<{
    include: {
        organization: {
            select: {
                id: true,
                name: true,
            },
        },
        person: {
            select: {
                id: true,
                name: true,
            },
        },
    },
}>;

export type DecisionMakerActorEntityWithRelatedData = Prisma.ActorGetPayload<{
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
}>;