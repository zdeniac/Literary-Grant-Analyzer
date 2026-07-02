import { Router } from "express";
import { create{{ pascalCase }}Module } from "./{{ kebabCase }}.factory";
import { validate } from "../../common/middleware/validate";
import { {{ pascalCase }}Schema } from "./validate/{{ kebabCase }}.schema";

const router = Router();
const { controller } = create{{ pascalCase }}Module();

router.get(
    '/:id',
    controller.findById,
);

router.put(
    '/:id',
    validate({{ pascalCase }}Schema),
    controller.update,
);

router.delete(
    '/:id',
    controller.delete,
);

router.post(
    '/',
    validate({{ pascalCase }}Schema),
    controller.create,
);

router.get(
    '/',
    controller.findAll,
);

export default router;
