import { Router } from "express";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { OrganizationSchema, UpdateOrganizationSchema } from "./validation/organization.schema";

const router = Router();
const { controller, crudController } = createOrganizationModule();

router.get(
    '/:id',
    crudController.findById,
);

router.patch(
    '/:id',
    validate(UpdateOrganizationSchema),
    crudController.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(OrganizationSchema),
    controller.create,
);

router.get(
    '/',
    crudController.findAll,
);

export default router;