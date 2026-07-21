import { SourceDocument } from "@prisma/client";
import { SourceDocumentDto, SourceDocumentModel } from "../dto/source-document.dto";
import { DtoMapper } from "../../../common/types/types";

export const toSourceDocumentDto: DtoMapper<SourceDocumentModel, SourceDocumentDto> = (
    sourceDocument
) => ({
    id: sourceDocument.id,
    
    title: sourceDocument.title,
    url: sourceDocument.url,

    retrievedAt: sourceDocument.retrievedAt,
    
    createdAt: sourceDocument.createdAt,
    updatedAt: sourceDocument.updatedAt,
});