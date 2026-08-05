import { Database } from "../../db/types";
import { ImportJobSourceDocumentRepository } from "./import-job-source-document.repository";
import { ImportJobSourceDocumentService } from "./import-job-source-document.service";

export const createImportJobSourceDocumentService = (db: Database) => (
    new ImportJobSourceDocumentService(
        new ImportJobSourceDocumentRepository(db.importJobSourceDocument),
    )
);