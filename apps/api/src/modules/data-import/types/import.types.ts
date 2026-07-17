import z, { ZodObject } from "zod";
import { modelNameSchema } from "../validation/data-import.validation";

export type ImportHeader = string[];
export type ImportRow = Record<string, unknown>;
export type ModelName = z.infer<typeof modelNameSchema>;

export type ImportFile = {
    name: string;
    mimeType: string;
    // The header of the data table
    header: ImportHeader;
    rows: ImportRow[];
};

export type ImportFieldType = 'string' | 'number' | 'email' | 'enum' | 'boolean' | 'date';
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

export type RelationBlueprint = {
    model: ModelName;

    sourceField: string;
    lookupField: string;

    foreignKey: string;
    targetField: string;
};

export type RelationalModelBlueprint = ModelBlueprint & {
    relations: RelationBlueprint[];
};

export type Blueprint = ModelBlueprint | RelationalModelBlueprint;

export interface ImportLookup<TModel>
{
    findManyBy(field: string, values: unknown[]): Promise<TModel[]>;
}

export interface ImportWriter<TCreate>
{
    createMany(data: TCreate[]): Promise<number>;
}

// Type guard
export function isRelationalModelBlueprint(blueprint: Blueprint): blueprint is RelationalModelBlueprint 
{
    return 'relations' in blueprint;
}
