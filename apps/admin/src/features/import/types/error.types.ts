export type ImportRowError = {
    row: number;
    issues: ImportIssue[];
};

export type ImportIssue = {
    message: string;
    path?: string[];
    field?: string;
    value?: unknown;
};
