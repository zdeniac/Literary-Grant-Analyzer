import type { ButtonProps } from "react-admin";
import type { FileDelimiter } from "../../../../../packages/shared/enums";

export type ImportFormProps = {
    submitRoute: string,
    acceptedFormats: AcceptedFormat[],
    defaultFileDelimiter: FileDelimiter,
    onDelimiterChange: (delimiter: FileDelimiter) => void;
} & ButtonProps;

export type ImportFormValues = 
    | {
        delimiter: FileDelimiter;
        saveSourceDocument: false;
        file?: {
            rawFile: File;
        };
    }
    | {
        delimiter: FileDelimiter;
        saveSourceDocument: true;
        sourceDocuments?: {
            title: string;
            url: string;
            issuingOrganizationId: string;
            retrievedAt: string;
        }[];
        file: {
            rawFile: File;
        };
    };

export type AcceptedFormat = 
    | { mimeType: 'text/csv', extension: '.csv' };
