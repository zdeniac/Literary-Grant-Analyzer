import { Actor, ActorType } from "@prisma/client";
import { Database } from "../../db/types";
import { DecisionMakerActorEntityWithRelatedData, RecipientActorEntityWithRelatedData } from "./types/actor.types";

export class ActorRepository
{
    constructor(
        private readonly model: Database['actor']
    ) {}

    async create(type: ActorType): Promise<Actor>
    {
        return this.model.create({ data: { type } });
    }

    async delete(id: number): Promise<Actor>
    {
        return this.model.delete({
            where: {
                id
            }
        });
    }

    async findAllRecipient(): Promise<RecipientActorEntityWithRelatedData[]>
    {
        return this.model.findMany({
            where: {
                type: {
                    in: [ActorType.ORGANIZATION, ActorType.PERSON]
                }
            },
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
                    }
                }
            }
        })
    }

    async findAllDecisionMaker(): Promise<DecisionMakerActorEntityWithRelatedData[]>
    {
        return this.model.findMany({
            where: {
                type: {
                    in: [ActorType.ORGANIZATION, ActorType.DECISION_AUTHORITY]
                }
            },
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
        })
    }
}