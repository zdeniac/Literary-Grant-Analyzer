import { ActorRepository } from "./actor.repository";

export class ActorService
{
    constructor(
        private readonly repository: ActorRepository
    ){
    }

    async getRecipients()
    {
        return this.repository.findAllRecipients();
    }

    async getDecisionMakers()
    {
        return this.repository.findAllDecisionMakers();
    }
}