import { Router } from "express";
import { createDecisionAuthorityModule } from "./decision-authority.factory";
import { createDecisionAuthorityInputSchema, decisionAuthoritySearchableFieldSchema, decisionAuthoritySortableFieldSchema, updateDecisionAuthoritySchema } from "./validation/decision-authority.schema";
import { validate } from "../../common/middleware/validate.middleware";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { DecisionAuthoritySearchableField, DecisionAuthoritySortableField } from "./types/decision-authority.types";
import { validateSearch } from "../../common/middleware/validate-search.middleware";

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
    validateSort<DecisionAuthoritySortableField>(decisionAuthoritySortableFieldSchema),
    validateSearch<DecisionAuthoritySearchableField>(decisionAuthoritySearchableFieldSchema),
    controller.list,
);

export default router;