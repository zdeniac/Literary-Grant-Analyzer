import { prisma } from "../../db/prisma";
import { toSourceDocumentDto } from "./mapper/source-document.mapper";
import { CrudController } from "../../common/controllers/crud.controller2";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository2";
import { CrudService } from "../../common/services/crud.service2";

export const createSourceDocumentModule = () => {
    const controller = new CrudController(
        new CrudService(new PrismaCrudRepository(prisma.sourceDocument)),
        toSourceDocumentDto,
    );
    
    return {
        controller,
    }
};