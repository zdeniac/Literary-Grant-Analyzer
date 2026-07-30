export class ImportSourceDocumentApiError extends Error
{
    static readonly code = 'IMPORT_SOURCE_DOCUMENTS_ERROR';
    
    constructor() {
        super('Document import failed.');
    }
}