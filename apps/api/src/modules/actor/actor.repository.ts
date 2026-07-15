import { Actor, ActorType } from "@prisma/client";
import { PrismaDatabase, PrismaModel } from "../../db/types";
import { PrismaRepository } from "../../db/prisma-repository";

export class ActorRepository extends PrismaRepository<Actor>
{
    constructor(db: PrismaDatabase)
    {
        super(db);
    }

    protected get model(): PrismaModel<Actor>
    {
        return this.db.actor;
    }
    
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