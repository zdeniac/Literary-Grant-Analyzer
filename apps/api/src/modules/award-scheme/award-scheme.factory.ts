import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { AwardSchemeController } from "./award-scheme.controller";
import { AwardSchemeRepository } from "./award-scheme.repository";
import { AwardSchemeService } from "./award-scheme.service";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";
import { AwardSchemeSortableField } from "./types/award-scheme.types";

export const createAwardSchemeModule = () => {
    const crudRepo = new PrismaCrudRepository(prisma.awardScheme);
    const crudController = new CrudController(
        new CrudService(crudRepo),
        toAwardSchemeDto,
    );

    const repo = new AwardSchemeRepository(
        prisma.awardScheme,
        new ListDbQueryBuilder<AwardSchemeSortableField>()
    );

    const service = new AwardSchemeService(repo);
    const controller = new AwardSchemeController(service);

    return {
        crudController,
        controller,
    }
};