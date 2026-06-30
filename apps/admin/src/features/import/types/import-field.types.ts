export type ImportFormValues = {
    file?: {
        rawFile: File;
    };
};

export type AcceptedFormat = {
    mimeType: 'text/csv',
    extension: string
};
