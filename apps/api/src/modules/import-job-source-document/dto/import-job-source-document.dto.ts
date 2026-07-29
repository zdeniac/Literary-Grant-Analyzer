import { Id } from "../../../common/types/types";

export type ImportJobSourceDocumentModel = ImportJobSourceDocumentDto;
export type CreateImportJobSourceDocumentDto = Omit<ImportJobSourceDocumentDto, 'id'>;

export type ImportJobSourceDocumentDto = {
    id: Id;

    sourceDocumentId: Id;
    importJobId: Id;
};