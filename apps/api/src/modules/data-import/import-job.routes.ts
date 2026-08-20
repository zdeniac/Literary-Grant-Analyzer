import { Router } from "express";
import { createImportJobModule } from "./factory/import-job.factory";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { ImportJobSearchableField, ImportJobSortableField } from "./types/http.types";
import { importJobSearchableFieldSchema, importJobSortableFieldSchema } from "./validation/import-job.validation";
import { validateSearch } from "../../common/middleware/validate-search.middleware";

const router = Router();
const { controller } = createImportJobModule();

router.get(
    '/:id',
    controller.show
);

router.get(
    '/',
    parseListQuery,
    validateSort<ImportJobSortableField>(importJobSortableFieldSchema),
    validateSearch<ImportJobSearchableField>(importJobSearchableFieldSchema),
    controller.list,
);

export default router;