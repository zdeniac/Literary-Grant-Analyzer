export type ImportFile = {
    name: string;
    extension: string;
    // The header of the data table
    header: string[];
    rows: Record<string, unknown>[];
};
