import z from "zod";

export type ImportRowError = {
    row: number;
    issues: ImportIssue[] | z.core.$ZodIssue[];
};

export type ImportIssue = {
    message: string;
    field?: string;
    value?: unknown;
};
