import { Router } from "express";
import { createAwardSchemeModule } from "./award-scheme.factory";
import { validate } from "../../common/middleware/validate";
import { AwardSchemeSchema } from "./validate/award-scheme.schema";

const router = Router();
const { controller } = createAwardSchemeModule();

router.get(
    '/:id',
    controller.findById,
);

router.put(
    '/:id',
    validate(AwardSchemeSchema),
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