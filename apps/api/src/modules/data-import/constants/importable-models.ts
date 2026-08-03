import z from "zod";

export const importableModelNames = [
    'journal',
    'organization',
    'awardScheme',
    'decisionAuthority',
    'awardDecision',
] as const;

export const importableModelSchema = z.enum(importableModelNames);
export type ImportableModel = z.infer<typeof importableModelSchema>;
