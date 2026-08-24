export type ImportHeader = string[];
export type ImportRow = Record<string, unknown>;

export type ImportFile = {
    fileName: string;
    mimeType: string;
    // The header of the data table
    header: ImportHeader;
    rows: ImportRow[];
};

export type ImportFieldType =
    | 'string'
    | 'number'
    | 'email'
    | 'enum'
    | 'boolean'
    | 'date'
    | 'array[enum]'
    | 'array[string]';

export type ImportField = {
    name: string;
    type: ImportFieldType;
    required: boolean;
    options?: string[];
};

export type AcceptedFormat =  
    | { mimeType: 'text/csv', extension: '.csv' };

export type ImportSchema = {
    fields: ImportField[],
    acceptedFormats: AcceptedFormat[],
};

export type ImportOptions = {
    validation?: {
        allowUnknownFields: boolean;
    };
}
