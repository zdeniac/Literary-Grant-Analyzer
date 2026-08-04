import z, { ZodObject } from "zod";
import { ImportableModelName } from "../validation/data-import.validation.schema";

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
export type ModelName = ImportableModelName;

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

export type ModelBlueprint = {
    model: ModelName;
    fields: ImportField[];
    schema: ZodObject;
};

/**
 * Represents a value from the imported row to a related database record.
 *
 * Example:
 * sourceField: 'organizationName'
 * lookupField: 'name'
 *
 * means that the value of the imported 'organizationName' column
 * is matched against the Organization.name column.
 */
export type RelationBlueprint = SimpleRelationBlueprint | CompositeRelationBlueprint;

export type RelationMapping = {
    // Field written to the imported row after the relation is resolved.
    foreignKey: string;

    // Field copied from the matched related record.
    targetField: string;
};

export type SimpleLookup = {
    // Column name in the imported file.
    sourceField: string;

    // Field of the related model used for the lookup.
    lookupField: string;
};

export type SimpleRelationBlueprint = RelationMapping & {
    // The related model. Can be a single model or an array of models, 
    // e.g. for polymorphic relations.
    model: ModelName | ModelName[];

    // One or more fields used to uniquely identify the related record.
    lookup: SimpleLookup;

    // Whether the imported column may contain multiple values
    // (e.g. 'Org A|Org B' for an N:M relation).
    multiple?: boolean;
};

export type CompositeLookup = Array<SimpleLookup & {    
    // Used when the input sourceField's value is not unique 
    // (e.g., multiple records with the same name).
    foreignModel?: ModelName;
    foreignKey?: string;
}>;

export type CompositeRelationBlueprint = RelationMapping & {
    // The related model. Can be a single model or an array of models, 
    // e.g. for polymorphic relations.
    // model: ModelName;
    model: ModelName;

    // One or more fields used to uniquely identify the related record.
    lookup: CompositeLookup;
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

export type RelationResolverRegistry = {
    simple: RelationResolverInterface<SimpleRelationBlueprint>;
    composite: RelationResolverInterface<CompositeRelationBlueprint>;
};

export interface RelationResolverInterface<T extends RelationBlueprint>
{
    resolve(rows: ImportRow[], relationBlueprint: T): Promise<ImportRow[]>;
}

export interface ImportLookupInterface<TModel>
{
    findManyBy(field: string, values: unknown[], options?: LookupQueryOptions): Promise<TModel[]>;
}

export interface ImportWriterInterface<TCreate>
{
    createMany(data: TCreate[]): Promise<number>;
}
