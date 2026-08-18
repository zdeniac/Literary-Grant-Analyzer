import { Router } from "express";
import { createAwardSchemeModule } from "./award-scheme.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { awardSchemeSortableFieldSchema, createAwardSchemeSchema, updateAwardSchemeSchema } from "./validation/award-scheme.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { AwardSchemeSortableField } from "./types/award-scheme.types";

const router = Router();
const { crudController, controller } = createAwardSchemeModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(updateAwardSchemeSchema),
    crudController.update,
);

router.delete(
    '/:id',
    crudController.delete,
);

router.post(
    '/',
    validate(createAwardSchemeSchema),
    crudController.create,
);

router.get(
    '/',
    parseListQuery,
    validateListQuery<AwardSchemeSortableField>(awardSchemeSortableFieldSchema),
    controller.list,
);

export default router;