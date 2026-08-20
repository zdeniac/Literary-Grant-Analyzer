import { Router } from "express";
import { createAwardDecisionModule } from "./award-decision.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { awardDecisionSearchableFieldSchema, awardDecisionSortableFieldSchema, createAwardDecisionSchema, updateAwardDecisionSchema } from "./validation/award-decision.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { AwardDecisionSearchableField, AwardDecisionSortableField } from "./types/award-decision.types";
import { validateSearch } from "../../common/middleware/validate-search.middleware";

const router = Router();
const { controller, crudController } = createAwardDecisionModule();

router.get(
    '/:id',
    controller.show,
);

router.patch(
    '/:id',
    validate(updateAwardDecisionSchema),
    crudController.update,
);

router.delete(
    '/:id',
    crudController.delete,
);

router.post(
    '/',
    validate(createAwardDecisionSchema),
    crudController.create,
);

router.get(
    '/',
    parseListQuery,
    validateSort<AwardDecisionSortableField>(awardDecisionSortableFieldSchema),
    validateSearch<AwardDecisionSearchableField>(awardDecisionSearchableFieldSchema),
    controller.list,
);

export default router;