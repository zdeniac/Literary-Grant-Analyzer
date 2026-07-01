import { Router } from "express";
import { createDecisionBodyModule } from "./decision-body.factory";
import { DecisionBodySchema } from "./validation/decision-body.schema";
import { validate } from "../../common/middleware/validate";

const router = Router();
const { controller } = createDecisionBodyModule();

router.get(
    '/:id',
    controller.findById,
);

router.put(
    '/:id',
    validate(DecisionBodySchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(DecisionBodySchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;