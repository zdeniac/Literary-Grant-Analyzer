import { Router } from "express";
import { createPersonModule } from "./person.factory";
import { createPersonSchema, personSortableFieldSchema, updatePersonSchema } from "./validation/person.schema";
import { validate } from "../../common/middleware/validate.middleware";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { PersonSortableField } from "./types/person.types";

const router = Router();
const { controller } = createPersonModule();

router.get(
    '/:id',
    controller.show,
);

router.patch(
    '/:id',
    validate(updatePersonSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createPersonSchema),
    controller.create,
);

router.get(
    '/',
    parseListQuery,
    validateSort<PersonSortableField>(personSortableFieldSchema),
    controller.list,
);

export default router;