import { Actor, ActorType } from "@prisma/client";
import { Database } from "../../db/types";
import { RecipientDto } from "./dto/ actor.dto";
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

    async findAllRecipients(): Promise<RecipientActorEntityWithRelatedData[]>
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

    async findAllDecisionMakers(): Promise<DecisionMakerActorEntityWithRelatedData[]>
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
        })
    }
}