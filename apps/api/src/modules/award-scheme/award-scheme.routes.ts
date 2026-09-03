import { Router } from "express";
import { createAwardSchemeModule } from "./award-scheme.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { awardSchemeSearchableFieldSchema, awardSchemeSortableFieldSchema, createAwardSchemeSchema, updateAwardSchemeSchema } from "./validation/award-scheme.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { AwardSchemeSearchableField, AwardSchemeSortableField } from "./types/award-scheme.types";
import { validateSearch } from "../../common/middleware/validate-search.middleware";

const router = Router();
const { controller } = createAwardSchemeModule();

router.get(
    '/:id',
    controller.show,
);

router.patch(
    '/:id',
    validate(updateAwardSchemeSchema),
    controller.update,
);

router.delete(
    '/',
    controller.deleteMany
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createAwardSchemeSchema),
    controller.create,
);

router.get(
    '/',
    parseListQuery,
    validateSort<AwardSchemeSortableField>(awardSchemeSortableFieldSchema),
    validateSearch<AwardSchemeSearchableField>(awardSchemeSearchableFieldSchema),
    controller.list,
);

export default router;