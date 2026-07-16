import { Router } from "express";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { OrganizationSchema, UpdateOrganizationSchema } from "./validation/organization.schema";

const router = Router();
const { controller } = createOrganizationModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(UpdateOrganizationSchema),
    controller.update,
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
    controller.findAll,
);

export default router;