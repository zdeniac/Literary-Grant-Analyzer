import { Request, Response, Router } from "express";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate";
import { OrganizationSchema } from "./validation/organization.schema";

const router = Router();
const { controller } = createOrganizationModule();

router.get(
    '/:id',
    asyncHandler(controller.findById),
);

router.put(
    '/:id',
    validate(OrganizationSchema),
    asyncHandler(controller.update),
);

router.delete(
    '/:id',
    asyncHandler(controller.delete),
);

router.post(
    '/',
    validate(OrganizationSchema),
    asyncHandler(controller.create),
);

router.get(
    '/',
    asyncHandler (controller.findAll),
);

export default router;