import { EventDispatcher } from "../../../common/events/event-dispatcher";
import { ImportCompletedWithSourceDocumentsHandler } from "../event/import-completed-with-documents.handler";

export const createImportEventDispatcher = () => (
    new EventDispatcher([
        new ImportCompletedWithSourceDocumentsHandler(),
    ])
);