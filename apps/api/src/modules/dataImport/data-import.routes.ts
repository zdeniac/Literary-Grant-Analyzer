import { Router } from "express";
import { createDataImportModule } from "./data-import.factory";
import multer from "multer";

const router = Router();
const { controller } = createDataImportModule();
const upload = multer({
    storage: multer.memoryStorage(),
});

router.post(
    '/:model',
    upload.single('file'),
    controller.import.bind(controller),
);

export default router;