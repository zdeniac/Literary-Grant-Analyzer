import { Router } from "express";
import { createJournalModule } from "./journal.factory";
import { validate } from "../../common/middleware/validate";
import { CreateJournalSchemaWithOrganizations, UpdateJournalSchemaWithOrganizations } from "./validate/journal.schema";
import { createJournalOrganizationModule } from "../journal-organization/journal-organization.factory";
import { CreateJournalOrganizationSchema } from "../journal-organization/validate/journal-organization.schema";

const router = Router();
const { controller, crudController } = createJournalModule();
const pivotController = createJournalOrganizationModule().controller;

router.post(
    '/:id/organizations',
    validate(CreateJournalOrganizationSchema),
    pivotController.create,
);

router.get(
    '/:id',
    controller.findById,
);

router.patch(
    '/:id',
    validate(UpdateJournalSchemaWithOrganizations),
    crudController.update,
);

router.delete(
    '/:id',
    crudController.delete,
);

router.post(
    '/',
    validate(CreateJournalSchemaWithOrganizations),
    controller.create,
);

router.get(
    '/',
    crudController.findAll,
);

export default router;
