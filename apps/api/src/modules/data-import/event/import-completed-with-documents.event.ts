import { EventInterface } from "../../../common/events/event.types";
import { CreateSourceDocumentInput } from "../../source-document/dto/source-document.input.dto";
import { ModelName } from "../types/import.types";

export class ImportCompletedWithSourceDocumentsEvent implements EventInterface
{
    constructor(
        public readonly importJobId: number,
        public readonly model: ModelName,
        public readonly total: number,
        public readonly sourceDocuments: CreateSourceDocumentInput[],
    ) {}
}