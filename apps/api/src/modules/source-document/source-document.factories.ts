import { prisma } from "../../db/prisma";
import { toSourceDocumentDto } from "./mapper/source-document.mapper";
import { CrudController } from "../../common/controllers/crud.controller";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { CrudService } from "../../common/services/crud.service";
import { Database } from "../../db/types";
import { SourceDocumentRepository } from "./source-document.repository";
import { SourceDocumentService } from "./source-document.service";

export const createSourceDocumentModule = () => {
    const repository = createSourceDocumentRepository(prisma);

    const service = new CrudService(repository);

    const controller = new CrudController(
        service,
        toSourceDocumentDto,
    );

    return {
        controller,
    };
};

export const createSourceDocumentRepository = (db: Database) => (
    new SourceDocumentRepository(
        new PrismaCrudRepository(db.sourceDocument),
        db.sourceDocument  
    )
);

export const createSourceDocumentService = (db: Database) => (
    new SourceDocumentService(
        new SourceDocumentRepository(
            new PrismaCrudRepository(db.sourceDocument),
            db.sourceDocument  
        ),
    )
);