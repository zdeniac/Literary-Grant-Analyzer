import { Router } from "express";
import { createAwardDecisionModule } from "./award-decision.factory";
import { validate } from "../../common/middleware/validate";
import { createAwardDecisionSchema, updateAwardDecisionSchema } from "./validation/award-decision.schema";

const router = Router();
const { controller, crudController } = createAwardDecisionModule();

router.get(
    '/:id',
    controller.findById,
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
    controller.findAll,
);

export default router;