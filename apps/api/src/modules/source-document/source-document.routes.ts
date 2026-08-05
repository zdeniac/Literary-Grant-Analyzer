import { Router } from "express";
import { createSourceDocumentCrudModule } from "./source-document.factories";
import { validate } from "../../common/middleware/validate";
import { createSourceDocumentSchema, updateSourceDocumentSchema } from "./validation/source-document.schema";

const router = Router();
const { controller } = createSourceDocumentCrudModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(updateSourceDocumentSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createSourceDocumentSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;