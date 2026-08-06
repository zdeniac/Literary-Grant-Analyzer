import z from "zod";

export type ImportFileRowError = {
    rowNum: number;
    issues: ImportIssue[] | z.core.$ZodIssue[];
};

export type ImportIssue = {
    message: string;
    field?: string;
    value?: unknown;
};
