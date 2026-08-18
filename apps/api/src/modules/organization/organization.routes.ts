import { Router } from "express";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { createOrganizationSchema, organizationSortableFieldSchema, updateOrganizationSchema } from "./validation/organization.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateListQuery } from "../../common/middleware/validate-list-query.middleware";
import { OrganizationSortableField } from "./types/organization.types";

const router = Router();
const { controller } = createOrganizationModule();

router.get(
    '/:id',
    controller.show,
);

router.patch(
    '/:id',
    validate(updateOrganizationSchema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate(createOrganizationSchema),
    controller.create,
);

router.get(
    '/',
    parseListQuery,
    validateListQuery<OrganizationSortableField>(organizationSortableFieldSchema),
    controller.list,
);

export default router;