import { SourceDocumentDto, SourceDocumentEntity } from "../dto/source-document.dto";
import { DtoMapper } from "../../../common/types/types";

export const toSourceDocumentDto: DtoMapper<SourceDocumentEntity, SourceDocumentDto> = (
    sourceDocument
) => ({
    id: sourceDocument.id,
    
    title: sourceDocument.title,
    url: sourceDocument.url,
    retrievedAt: sourceDocument.retrievedAt,

    issuingOrganizationId: sourceDocument.issuingOrganizationId,
    
    createdAt: sourceDocument.createdAt,
    updatedAt: sourceDocument.updatedAt,
});