import { Router } from "express";
import { createDecisionAuthorityModule } from "./decision-authority.factory";
import { createDecisionBodyInputSchema, updateDecisionBodySchema } from "./validation/decision-body.schema";
import { validate } from "../../common/middleware/validate";

const router = Router();
const { controller, crudController } = createDecisionAuthorityModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(updateDecisionBodySchema),
    crudController.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createDecisionBodyInputSchema),
    controller.create,
);

router.get(
    '/',
    crudController.findAll,
);

export default router;