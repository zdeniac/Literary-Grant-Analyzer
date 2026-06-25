import { Request, Response, Router } from "express";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { OrganizationSchema } from "./validation/organization.schema";

const router = Router();
const { controller } = createOrganizationModule();

router.get(
    '/:id',
    controller.findById,
);

router.put(
    '/:id',
    validate(OrganizationSchema),
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