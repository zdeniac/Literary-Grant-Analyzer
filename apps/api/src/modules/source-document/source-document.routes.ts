import { Router } from "express";
import { createSourceDocumentModule } from "./source-document.factory";
import { validate } from "../../common/middleware/validate";
import { SourceDocumentSchema, UpdateSourceDocumentSchema } from "./validation/source-document.schema";

const router = Router();
const { controller } = createSourceDocumentModule();

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(UpdateSourceDocumentSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(SourceDocumentSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;