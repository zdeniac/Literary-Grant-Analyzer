import { Router } from "express";
import { createAwardDecisionModule } from "./award-decision.factory";
import { validate } from "../../common/middleware/validate";
import { CreateAwardDecisionSchema, UpdateAwardDecisionSchema } from "./validation/award-decision.schema";

const router = Router();
const { controller } = createAwardDecisionModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(UpdateAwardDecisionSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(CreateAwardDecisionSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;