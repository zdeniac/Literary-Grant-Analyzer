import { Router } from "express";
import { createAwardDecisionModule } from "./award-decision.factory";
import { validate } from "../../common/middleware/validate";
import { CreateAwardDecisionSchema, UpdateAwardDecisionSchema } from "./validation/award-decision.schema";

const router = Router();
const { controller, crudController } = createAwardDecisionModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(UpdateAwardDecisionSchema),
    crudController.update,
);

router.delete(
    '/:id',
    crudController.delete,
);

router.post(
    '/',
    validate(CreateAwardDecisionSchema),
    crudController.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;