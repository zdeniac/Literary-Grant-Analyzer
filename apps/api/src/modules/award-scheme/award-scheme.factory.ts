import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";

export const createAwardSchemeModule = () => {
    const repository = new PrismaCrudRepository(prisma.awardScheme);
    const controller = new CrudController(
        new CrudService(repository),
        toAwardSchemeDto,
    );

    return {
        controller,
    }
};