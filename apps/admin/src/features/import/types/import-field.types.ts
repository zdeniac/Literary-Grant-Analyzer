export type ImportFormValues = 
    | {
        saveSourceDocument: false;
        file?: {
            rawFile: File;
        };
    }
    | {
        saveSourceDocument: true;
        sourceDocuments?: {
            title: string;
            url: string;
            retrievedAt: string;
        }[];
        file: {
            rawFile: File;
        };
    };

export type AcceptedFormat = 
    | { mimeType: 'text/csv', extension: '.csv' };
