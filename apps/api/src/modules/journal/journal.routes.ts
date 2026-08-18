import { Router } from "express";
import { createJournalModule } from "./journal.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { createJournalWithAffiliationsSchema, journalSortableFieldSchema, updateJournalWithAffiliationsSchema } from "./validate/journal.schema";
import { createJournalAffiliationModule } from "../journal-affiliation/journal-affiliation.factory";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { JournalSortableField } from "./types/journal.types";

const router = Router();
const { controller } = createJournalModule();
const pivotController = createJournalAffiliationModule().controller;

router.post(
    '/:id/affiliations',
    validate(createJournalWithAffiliationsSchema),
    pivotController.create,
);

router.get(
    '/:id',
    controller.show,
);

router.patch(
    '/:id',
    validate(updateJournalWithAffiliationsSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createJournalWithAffiliationsSchema),
    controller.create,
);

router.get(
    '/',
    parseListQuery,
    validateListQuery<JournalSortableField>(journalSortableFieldSchema),
    controller.list,
);

export default router;
