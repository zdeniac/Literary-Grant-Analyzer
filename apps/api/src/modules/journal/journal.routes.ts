import { Router } from "express";
import { createJournalModule } from "./journal.factory";
import { validate } from "../../common/middleware/validate";
import { createJournalWithAffiliationsSchema, updateJournalWithAffiliationsSchema } from "./validate/journal.schema";
import { createJournalAffiliationModule } from "../journal-affiliation/journal-affiliation.factory";

const router = Router();
const { controller, crudController } = createJournalModule();
const pivotController = createJournalAffiliationModule().controller;

router.post(
    '/:id/affiliations',
    validate(createJournalWithAffiliationsSchema),
    pivotController.create,
);

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(updateJournalWithAffiliationsSchema),
    crudController.update,
);

router.delete(
    '/:id',
    crudController.delete,
);

router.post(
    '/',
    validate(createJournalWithAffiliationsSchema),
    controller.create,
);

router.get(
    '/',
    crudController.findAll,
);

export default router;
