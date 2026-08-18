import { ListDbQueryBuilder } from "../../../db/list-db-query-builder";
import { prisma } from "../../../db/prisma";
import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobService } from "../service/import-job.service";
import { createImportJobController } from "./import-job-controller.factory";

export const createImportJobModule = () => {
    const repository = new ImportJobRepository(
        prisma.importJob,
        new ListDbQueryBuilder(),
    );
    const service = new ImportJobService(repository);

    return {
        controller: createImportJobController(service),
    };
};