import { Actor } from "@prisma/client";
import { ActorRepository } from "./actor.repository";

export class ActorService
{
    constructor(
        private readonly repository: ActorRepository
    ){
    }

    async getRecipients(): Promise<Actor[]>
    {
        return this.repository.findAllRecipient();
    }

    async getDecisionMakers(): Promise<Actor[]>
    {
        return this.repository.findAllDecisionMaker();
    }
}