import { SourceDocument } from "@prisma/client";
import { CrudController } from "../../common/controllers/crud.controller";
import { SourceDocumentDto } from "./dto/source-document.dto";
import { SourceDocumentService } from "./source-document.service";
import { DtoMapper } from "../../common/types/types";

export class SourceDocumentController extends CrudController<SourceDocument, SourceDocumentDto>
{
    constructor(
        service: SourceDocumentService,
        mapper: DtoMapper<SourceDocument, SourceDocumentDto>
    ) {
        super(service, mapper);
    }
}