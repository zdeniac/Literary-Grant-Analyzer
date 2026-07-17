import { Actor, ActorType } from "@prisma/client";
import { PrismaModel } from "../../db/types";

export class ActorRepository
{
    constructor(
        private readonly model: PrismaModel<Actor>
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