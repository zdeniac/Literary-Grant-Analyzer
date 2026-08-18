import { Router } from "express";
import { createDecisionAuthorityModule } from "./decision-authority.factory";
import { createDecisionAuthorityInputSchema, decisionAuthoritySortableFieldSchema, updateDecisionAuthoritySchema } from "./validation/decision-authority.schema";
import { validate } from "../../common/middleware/validate.middleware";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { DecisionAuthoritySortableField } from "./types/decision-authority.types";

const router = Router();
const { controller } = createDecisionAuthorityModule();

router.get(
    '/:id',
    controller.show,
);

router.patch(
    '/:id',
    validate(updateDecisionAuthoritySchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createDecisionAuthorityInputSchema),
    controller.create,
);

router.get(
    '/',
    parseListQuery,
    validateListQuery<DecisionAuthoritySortableField>(decisionAuthoritySortableFieldSchema),
    controller.list,
);

export default router;