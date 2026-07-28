import { prisma } from "../../../db/prisma";
import { ImportJobController } from "../controller/import-job.controller";
import { ImportJobRepository } from "../repository/import-job.repository";
import { ImportJobService } from "../service/import-job.service";

export const createImportJobModule = () => {
    const repository = new ImportJobRepository(prisma.importJob);
    const service = new ImportJobService(repository);

    return {
        controller: new ImportJobController(service),
    };
};