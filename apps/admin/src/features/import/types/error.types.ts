export type ImportRowError = {
    rowNum: number;
    issues: ImportIssue[];
};

export type ImportIssue = {
    message: string;
    path?: string[];
    field?: string;
    value?: unknown;
};
