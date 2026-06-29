import { Router } from "express";
import { createImportModule } from "./import.factory";
import multer from "multer";

const router = Router();
const { controller } = createImportModule();
const upload = multer({
    storage: multer.memoryStorage(),
});

router.get(
    '/schema',
    controller.getSchema.bind(controller),
);

router.post(
    '/:model',
    upload.single('file'),
    controller.import.bind(controller),
);

export default router;