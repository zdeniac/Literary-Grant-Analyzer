import { Router } from "express";
import { createImportJobModule } from "./factory/import-job.factory";

const router = Router();
const { controller } = createImportJobModule();

router.get(
    '/',
    controller.findAll,
);

export default router;