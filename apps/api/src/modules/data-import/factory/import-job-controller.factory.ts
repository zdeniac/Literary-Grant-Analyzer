import { ImportJobController } from "../controller/import-job.controller";
import { ImportJobService } from "../service/import-job.service";

export const createImportJobController = (service: ImportJobService) => (
    new ImportJobController(service)
);