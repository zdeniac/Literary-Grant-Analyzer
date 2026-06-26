export type ImportFormValues = {
    file?: {
        rawFile: File;
    };
};

export type AcceptedFormat = {
    mimeType: string,
    extension: string
};
