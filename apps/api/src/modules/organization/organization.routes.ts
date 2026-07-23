import { Router } from "express";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { createOrganizationSchema, updateOrganizationSchema } from "./validation/organization.schema";

const router = Router();
const { controller, crudController } = createOrganizationModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(updateOrganizationSchema),
    crudController.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createOrganizationSchema),
    controller.create,
);

router.get(
    '/',
    crudController.findAll,
);

export default router;