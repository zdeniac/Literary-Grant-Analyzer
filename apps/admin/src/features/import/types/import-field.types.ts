export type ImportFormValues = {
    saveSourceDocument?: boolean;
    file?: {
        rawFile: File;
    };
};

export type AcceptedFormat = 
    | { mimeType: 'text/csv', extension: '.csv' };
