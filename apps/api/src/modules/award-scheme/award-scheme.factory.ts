import { CrudController } from "../../common/controllers/crud.controller";
import { CrudService } from "../../common/services/crud.service";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";
import { prisma } from "../../db/prisma";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { Database } from "../../db/types";
import { AwardSchemeController } from "./award-scheme.controller";
import { AwardSchemeRepository } from "./award-scheme.repository";
import { AwardSchemeService } from "./award-scheme.service";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";

export const createAwardSchemeModule = () => {
    const service = new AwardSchemeService(
        createAwardSchemeRepository(prisma.awardScheme, true)
    );
    const controller = new AwardSchemeController(
        service, 
        toAwardSchemeDto
    );

    return {
        controller,
    }
};

export const createAwardSchemeRepository = (awardScheme: Database['awardScheme'], withQueryBuilders?: boolean) => {
    const crudRepo = new PrismaCrudRepository(awardScheme);

    const listQb = withQueryBuilders ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    ) : undefined;

    return new AwardSchemeRepository(awardScheme, crudRepo, listQb);
};