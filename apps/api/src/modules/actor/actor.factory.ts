import { prisma } from "../../db/prisma";
import { Database } from "../../db/types";
import { ActorController } from "./actor.controller";
import { ActorRepository } from "./actor.repository";
import { ActorService } from "./actor.service";

export const createActorModule = () => {
    const controller = new ActorController(
        new ActorService(
            createActorRepository(prisma.actor),
        ),
    );

    return {
        controller
    }
};

export const createActorRepository = (entity: Database['actor']) => {
    return new ActorRepository(entity);
}