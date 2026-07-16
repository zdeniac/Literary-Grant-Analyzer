import { CrudController } from "../../common/controllers/crud.controller2";
import { CrudService } from "../../common/services/crud.service2";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository2";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";

export const createAwardSchemeModule = () => {
    const controller = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.awardScheme)),
        toAwardSchemeDto,
    );

    return {
        controller,
    }
};