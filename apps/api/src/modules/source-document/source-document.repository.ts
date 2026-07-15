import { SourceDocument } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { CreateSourceDocumentDto, UpdateSourceDocumentDto } from "./dto/source-document.dto";

export class SourceDocumentRepository 
    extends PrismaCrudRepository<SourceDocument, CreateSourceDocumentDto, UpdateSourceDocumentDto>
{
    protected get model(): PrismaModel<SourceDocument>
    {
        return this.db.sourceDocument;
    }    
}