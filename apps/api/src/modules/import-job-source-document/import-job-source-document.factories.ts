import { prisma } from "../../db/prisma";
import { Database } from "../../db/types";
import { ImportJobSourceDocumentRepository } from "./import-job-source-document.repository";
import { ImportJobSourceDocumentService } from "./import-job-source-document.service";

export const createImportJobSourceDocumentService = () => (
    new ImportJobSourceDocumentService(
        new ImportJobSourceDocumentRepository(prisma.importJobSourceDocument),
    )
);