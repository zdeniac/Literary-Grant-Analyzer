import { SourceDocument } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateSourceDocumentDto, UpdateSourceDocumentDto } from "./dto/source-document.dto";

export class SourceDocumentRepository extends PrismaCrudRepository<
    SourceDocument, 
    CreateSourceDocumentDto, 
    UpdateSourceDocumentDto 
> {
    constructor(model: PrismaModel<SourceDocument>) {
        super(model);
    }
}