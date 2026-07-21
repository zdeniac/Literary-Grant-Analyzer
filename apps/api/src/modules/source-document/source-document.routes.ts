import { Router } from "express";
import { createSourceDocumentModule } from "./source-document.factory";
import { validate } from "../../common/middleware/validate";
import { sourceDocumentSchema, updateSourceDocumentSchema } from "./validation/source-document.schema";

const router = Router();
const { controller } = createSourceDocumentModule();

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
    validate(sourceDocumentSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;