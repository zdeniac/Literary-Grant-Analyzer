import { Router } from "express";
import { createPersonModule } from "./person.factory";
import { createPersonSchema, updatePersonSchema } from "./validation/person.schema";
import { validate } from "../../common/middleware/validate";

const router = Router();
const { controller, crudController } = createPersonModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(updatePersonSchema),
    crudController.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createPersonSchema),
    controller.create,
);

router.get(
    '/',
    crudController.findAll,
);

export default router;