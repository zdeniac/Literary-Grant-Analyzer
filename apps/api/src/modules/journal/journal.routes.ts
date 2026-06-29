import { Router } from "express";
import { createJournalModule } from "./journal.factory";
import { validate } from "../../common/middleware/validate";
import { JournalSchema } from "./validate/journal.schema";

const router = Router();
const { controller } = createJournalModule();

router.get(
    '/:id',
    controller.findById,
);

router.put(
    '/:id',
    validate(JournalSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(JournalSchema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;
