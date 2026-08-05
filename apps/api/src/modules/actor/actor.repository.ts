import { Actor, ActorType } from "@prisma/client";
import { DatabaseCrudDelegate } from "../../db/types";

export class ActorRepository
{
    constructor(
        private readonly model: DatabaseCrudDelegate<Actor>
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
}