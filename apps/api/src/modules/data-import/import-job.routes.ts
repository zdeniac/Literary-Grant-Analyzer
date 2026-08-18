import { Router } from "express";
import { createImportJobModule } from "./factory/import-job.factory";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { ImportJobSortableField } from "./types/http.types";
import { importJobSortableFieldSchema } from "./validation/import-job.validation";

const router = Router();
const { controller } = createImportJobModule();

router.get(
    '/:id',
    controller.show
);

router.get(
    '/',
    parseListQuery,
    validateListQuery<ImportJobSortableField>(importJobSortableFieldSchema),
    controller.list,
);

export default router;