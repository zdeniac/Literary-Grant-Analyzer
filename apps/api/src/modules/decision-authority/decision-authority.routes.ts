import { Router } from "express";
import { createDecisionAuthorityModule } from "./decision-authority.factory";
import { createDecisionAuthorityInputSchema, updateDecisionAuthoritySchema } from "./validation/decision-authority.schema";
import { validate } from "../../common/middleware/validate";

const router = Router();
const { controller, crudController } = createDecisionAuthorityModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(updateDecisionAuthoritySchema),
    crudController.update,
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
    crudController.findAll,
);

export default router;