import { Router } from "express";
import { createOrganizationModule } from "./organization.factory";
import { validate } from "../../common/middleware/validate.middleware";
import { createOrganizationSchema, organizationSearchableFieldSchema, organizationSortableFieldSchema, updateOrganizationSchema } from "./validation/organization.schema";
import { parseListQuery } from "../../common/middleware/parse-list-query.middleware";
import { validateSort } from "../../common/middleware/validate-sort.middleware";
import { OrganizationSearchableField, OrganizationSortableField } from "./types/organization.types";
import { validateSearch } from "../../common/middleware/validate-search.middleware";

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

router.delete(
    '/',
    controller.deleteMany,
);

router.post(
    '/',
    validate(createOrganizationSchema),
    controller.create,
);

router.get(
    '/',
    parseListQuery,
    validateSort<OrganizationSortableField>(organizationSortableFieldSchema),
    validateSearch<OrganizationSearchableField>(organizationSearchableFieldSchema),
    controller.list,
);

export default router;