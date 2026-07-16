import { prisma } from "../../db/prisma";
import { SourceDocumentController } from "./source-document.controller";
import { SourceDocumentRepository } from "./source-document.repository";
import { SourceDocumentService } from "./source-document.service";
import { toSourceDocumentDto } from "./mapper/source-document.mapper";

export const createSourceDocumentModule = () => {
    const service = new SourceDocumentService(new SourceDocumentRepository(prisma));
    const controller = new SourceDocumentController(service, toSourceDocumentDto);

    return {
        controller,
    }
};