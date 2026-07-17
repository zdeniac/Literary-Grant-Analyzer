import { prisma } from "../../db/prisma";
import { toSourceDocumentDto } from "./mapper/source-document.mapper";
import { CrudController } from "../../common/controllers/crud.controller";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { CrudService } from "../../common/services/crud.service";

export const createSourceDocumentModule = () => {
    const controller = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.sourceDocument)),
        toSourceDocumentDto,
    );
    
    return {
        controller,
    }
};