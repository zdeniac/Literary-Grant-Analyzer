import { Router } from "express";
import { createAwardSchemeModule } from "./award-scheme.factory";
import { validate } from "../../common/middleware/validate";
import { AwardSchemeSchema, UpdateAwardSchemeSchema } from "./validation/award-scheme.schema";

const router = Router();
const { controller } = createAwardSchemeModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(UpdateAwardSchemeSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(AwardSchemeSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;