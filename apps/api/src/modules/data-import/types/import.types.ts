import z, { ZodObject } from "zod";
import { modelNameSchema } from "../validation/data-import.validation.schema";

export type LookupConfig = Map<string, LookupFieldConfig>;
export type LookupFieldConfig = {
    normalizers: Normalizer[];
    query?: LookupQueryOptions;
};

export type Normalizer = (value: unknown) => unknown;

export type LookupQueryOptions = {
    mode: 'default' | 'insensitive';
};

export type ImportRowError = {
    row: number;
    issues: ImportIssue[];
};

export type ImportIssue = {
    message: string;
    field?: string;
    value?: unknown;
};

export type ImportHeader = string[];
export type ImportRow = Record<string, unknown>;
export type ModelName = z.infer<typeof modelNameSchema>;

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
    | { mimeType: 'text/csv'; extension: '.csv' };

export type ImportSchema = {
    fields: ImportField[],
    acceptedFormats: AcceptedFormat[],
};

export type ModelBlueprint = {
    model: ModelName;
    fields: ImportField[];
    schema: ZodObject;
};

/**
 * model: 'organization'
 * sourceField: 'organizationName'
 * lookupField: 'name'
 */
export type RelationBlueprint = {
    model: ModelName;

    // the header field from the ImportFile
    sourceField: string;
    
    // the foreign model's actual field from the db
    lookupField: string;

    foreignKey: string;
    targetField: string;

    // can have multiple values for the same field (e.g.: N:M relation)
    multiple?: boolean;
};

export type RelationalModelBlueprint = ModelBlueprint & {
    relations: RelationBlueprint[];
};

export type Blueprint = ModelBlueprint | RelationalModelBlueprint;

export type ImportOptions = {
    validation?: {
        allowUnknownFields: boolean;
    };
}

export interface ImportLookupInterface<TModel>
{
    findManyBy(field: string, values: unknown[], options?: LookupQueryOptions): Promise<TModel[]>;
}

export interface ImportWriterInterface<TCreate>
{
    createMany(data: TCreate[]): Promise<number>;
}
