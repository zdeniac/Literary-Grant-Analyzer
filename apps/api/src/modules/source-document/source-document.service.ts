import { SourceDocument } from "@prisma/client";
import { CreateSourceDocumentDto, UpdateSourceDocumentDto } from "./dto/source-document.dto";
import { SourceDocumentRepository } from "./source-document.repository";
import { CrudService } from "../../common/services/crud.service";

export class SourceDocumentService extends CrudService<SourceDocument, CreateSourceDocumentDto, UpdateSourceDocumentDto> {
    constructor(
        repository: SourceDocumentRepository
    ) {
        super(repository);
    }
}