import { prisma } from "../../db/prisma";
import { toSourceDocumentDto } from "./mapper/source-document.mapper";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { Database } from "../../db/types";
import { SourceDocumentRepository } from "./source-document.repository";
import { SourceDocumentService } from "./source-document.service";
import { SourceDocumentController } from "./source-document.controller";

export const createSourceDocumentCrudModule = () => {
    const controller = new SourceDocumentController(
        createSourceDocumentService(prisma),
        toSourceDocumentDto,
    );

    return {
        controller,
    };
};

export const createSourceDocumentRepository = (db: Database) => (
    new SourceDocumentRepository(
        db.sourceDocument,
        new PrismaCrudRepository(db.sourceDocument),
    )
);

export const createSourceDocumentService = (db: Database) => (
    new SourceDocumentService(
        createSourceDocumentRepository(db),
    )
);