import { Router } from "express";
import { createJournalModule } from "./journal.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { createJournalWithAffiliationsSchema, journalSearchableFieldSchema, journalSortableFieldSchema, updateJournalWithAffiliationsSchema } from "./validate/journal.schema";
import { createJournalAffiliationModule } from "../journal-affiliation/journal-affiliation.factory";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { JournalSearchableField, JournalSortableField } from "./types/journal.types";
import { validateSearch } from "../../common/middleware/validate-search.middleware";

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
    '/',
    controller.deleteMany,
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
    validateSort<JournalSortableField>(journalSortableFieldSchema),
    validateSearch<JournalSearchableField>(journalSearchableFieldSchema),
    controller.list,
);

export default router;
