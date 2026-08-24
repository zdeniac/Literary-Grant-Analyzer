import { ListDbQueryBuilder } from "../../../db/list-db-query-builder";
import { prisma } from "../../../db/prisma";
import { SearchQueryBuilder } from "../../../db/query-builders/search.query-builder";
import { SortQueryBuilder } from "../../../db/query-builders/sort.query-builder";
import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobService } from "../service/import-job.service";
import { createImportJobController } from "./import-job-controller.factory";

export const createImportJobModule = () => {
    const repository = new ImportJobRepository(
        prisma.importJob,
        new ListDbQueryBuilder(
            new SortQueryBuilder(),
            new SearchQueryBuilder(),
        ),
    );
    const service = new ImportJobService(repository);

    return {
        controller: createImportJobController(service),
    };
};