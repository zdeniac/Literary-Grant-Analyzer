import { CrudService } from "../../../../src/common/services/crud.service";
import { prisma } from "../../../../src/db/prisma";
import { PrismaCrudRepository } from "../../../../src/db/repositories/prisma-crud-repository";
import { SourceDocumentModel } from "../../../../src/modules/source-document/dto/source-document.dto";

const service = new CrudService(
    new PrismaCrudRepository(prisma.sourceDocument),
);

export const createSourceDocument = async (overrides: { 
    title?: string, 
    url?: string,
    retrievedAt?: Date,
}): Promise<SourceDocumentModel> => {
    return service.create({
        title: overrides.title ?? 'Teszt dokumentum',
        url: overrides.url ?? 'https://teszt-dokumentum.hu',
        retrievedAt: overrides.retrievedAt ?? new Date(Date.now()),
    });
};
