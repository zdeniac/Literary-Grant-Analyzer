import { Router } from "express";
import { createImportModule } from "./factory/import.factory";
import multer from "multer";

const router = Router();
const { controller } = createImportModule();
const upload = multer({
    storage: multer.memoryStorage(),
});

router.get(
    '/schema',
    controller.getSchema,
);

router.post(
    '/:entity',
    upload.single('file'),
    controller.import,
);

export default router;