import { prisma } from "../../db/prisma";
import { ActorController } from "./actor.controller";
import { ActorRepository } from "./actor.repository";
import { ActorService } from "./actor.service";

export const createActorModule = () => {
    const controller = new ActorController(
        new ActorService(
            new ActorRepository(prisma.actor),
        ),
    );

    return {
        controller
    }
};