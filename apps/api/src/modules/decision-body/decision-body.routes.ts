import { Router } from "express";
import { createDecisionBodyModule } from "./decision-body.factory";
import { DecisionBodySchema, UpdateDecisionBodySchema } from "./validation/decision-body.schema";
import { validate } from "../../common/middleware/validate";

const router = Router();
const { controller, crudController } = createDecisionBodyModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(UpdateDecisionBodySchema),
    crudController.update,
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
    crudController.findAll,
);

export default router;