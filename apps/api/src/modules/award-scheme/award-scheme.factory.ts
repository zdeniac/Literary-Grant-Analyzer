import { prisma } from "../../db/prisma";
import { AwardSchemeController } from "./award-scheme.controller";
import { AwardSchemeRepository } from "./award-scheme.repository";
import { AwardSchemeService } from "./award-scheme.service";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";

export const createAwardSchemeModule = () => {
    const service = new AwardSchemeService(new AwardSchemeRepository(prisma));
    const controller = new AwardSchemeController(service, toAwardSchemeDto);

    return {
        controller,
    }
};