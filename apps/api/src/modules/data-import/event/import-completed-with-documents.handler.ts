import { EventHandlerInterface } from "../../../common/events/event.types";
import { createRepositories } from "../../../db/repositories/factory";
import { transaction } from "../../../db/transaction";
import { ImportCompletedWithSourceDocumentsEvent } from "./import-completed-with-documents.event";

export class ImportCompletedWithSourceDocumentsHandler implements EventHandlerInterface
{
    async handle(event: ImportCompletedWithSourceDocumentsEvent): Promise<void>
    {
        return transaction(async tx => {
            const repositories = createRepositories(tx);
            
            const documentsRepo = repositories.sourceDocument;
            const importDocRepo = repositories.importJobSourceDocument;

            const documents = await Promise.all(
                event.sourceDocuments.map(document =>
                    documentsRepo.create(document)
                )
            );

            await importDocRepo.createMany(
                documents.map(document => ({
                    importJobId: event.importJobId,
                    sourceDocumentId: document.id,
                }))
            );
        });
    }
}