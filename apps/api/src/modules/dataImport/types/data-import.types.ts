import z from "zod";

export type ImportFile = {
    name: string;
    mimeType: string;
    // The header of the data table
    header: string[];
    rows: Record<string, unknown>[];
};

export type ModelBlueprint = {
    fields: string[];
    schema: z.ZodTypeAny;
};

export type RelationalBlueprint = ModelBlueprint & {
    relation: {
        repository: string;

        sourceField: string;
        lookupField: string;

        foreignKey: string;
        targetField: string;
    };
};

// Type guard
export function isRelationalBlueprint(
    blueprint: ModelBlueprint
): blueprint is RelationalBlueprint {
    return 'relation' in blueprint;
}
