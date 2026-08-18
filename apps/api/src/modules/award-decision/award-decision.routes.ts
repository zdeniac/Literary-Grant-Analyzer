import { Router } from "express";
import { createAwardDecisionModule } from "./award-decision.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { awardDecisionSortableFieldSchema, createAwardDecisionSchema, updateAwardDecisionSchema } from "./validation/award-decision.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { AwardDecisionSortableField } from "./types/award-decision.types";

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
    validateListQuery<AwardDecisionSortableField>(awardDecisionSortableFieldSchema),
    controller.list,
);

export default router;