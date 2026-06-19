export type ImportFile = {
    name: string;
    extension: string;
    header: string[];
    rows: Record<string, unknown>[];
};

export type ImportError = {
    row: number;
    issues: unknown[];
};