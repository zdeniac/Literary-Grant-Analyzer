import { prisma } from "../../db/prisma";
import { toSourceDocumentDto } from "./mapper/source-document.mapper";
import { PrismaCrudRepository } from "../../db/repositories/prisma-crud-repository";
import { Database } from "../../db/types";
import { SourceDocumentRepository } from "./source-document.repository";
import { SourceDocumentService } from "./source-document.service";
import { SourceDocumentController } from "./source-document.controller";
import { SortQueryBuilder } from "../../db/query-builders/sort.query-builder";
import { SearchQueryBuilder } from "../../db/query-builders/search.query-builder";
import { ListDbQueryBuilder } from "../../db/list-db-query-builder";

export const createSourceDocumentCrudModule = () => {
    const controller = new SourceDocumentController(
        createSourceDocumentService(),
        toSourceDocumentDto,
    );

    return {
        controller,
    };
};

export const createSourceDocumentRepository = (sourceDocument: Database['sourceDocument'], withListQuery?: boolean) => {
    const listQb = withListQuery ? new ListDbQueryBuilder(
        new SortQueryBuilder(),
        new SearchQueryBuilder(),
    ) : undefined;
    
    return new SourceDocumentRepository(
        sourceDocument,
        new PrismaCrudRepository(sourceDocument),
        listQb
    );
}

export const createSourceDocumentService = () => (
    new SourceDocumentService(
        createSourceDocumentRepository(prisma.sourceDocument, true),
    )
);