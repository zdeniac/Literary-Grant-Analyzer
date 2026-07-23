import { Router } from "express";
import { createAwardSchemeModule } from "./award-scheme.factory";
import { validate } from "../../common/middleware/validate";
import { createAwardSchemeSchema, updateAwardSchemeSchema } from "./validation/award-scheme.schema";

const router = Router();
const { controller } = createAwardSchemeModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(updateAwardSchemeSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createAwardSchemeSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;