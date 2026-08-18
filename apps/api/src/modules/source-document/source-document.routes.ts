import { Router } from "express";
import { createSourceDocumentCrudModule } from "./source-document.factories";
import { validate } from "../../common/middleware/validate.middleware";
import { createSourceDocumentSchema, sourceDocumentSortableFieldSchema, updateSourceDocumentSchema } from "./validation/source-document.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { SourceDocumentSortableField } from "./types/source-document.types";

const router = Router();
const { controller } = createSourceDocumentCrudModule();

router.get(
    '/:id',
    controller.show,
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
    parseListQuery,
    validateListQuery<SourceDocumentSortableField>(sourceDocumentSortableFieldSchema),
    controller.list,
);

export default router;