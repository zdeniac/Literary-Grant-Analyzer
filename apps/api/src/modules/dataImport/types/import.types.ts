import { ZodObject } from "zod";

export type ImportFile = {
    name: string;
    mimeType: string;
    // The header of the data table
    header: string[];
    rows: Record<string, unknown>[];
};

export type ImportHeader = string[];
export type ImportRow = Record<string, unknown>;
export type ImportFieldType = 'string' | 'number' | 'email' | 'enum' | 'boolean' | 'date';
export type ImportField = {
    name: string;
    type: ImportFieldType;
    required: boolean;
    options?: string[];
};

export type AcceptedFormat = {
    mimeType: 'text/csv',
    extension: '.csv'
};

export type ImportSchema = {
    fields: ImportField[],
    acceptedFormats: AcceptedFormat[],
};

export type ModelBlueprint = {
    model: string;
    fields: ImportField[];
    schema: ZodObject;
};

export type RelationalBlueprint = 
    ModelBlueprint & {
        relation: {
            repository: string;

            sourceField: string;
            lookupField: string;

            foreignKey: string;
            targetField: string;
        };
    };

export type Blueprint =
    ModelBlueprint | RelationalBlueprint;

// Type guard
export function isRelationalBlueprint(
    blueprint: Blueprint
): blueprint is RelationalBlueprint {
    return 'relation' in blueprint;
}
