import z from "zod";

export const importableEntityNames = [
    'journal',
    'organization',
    'awardScheme',
    'decisionAuthority',
    'awardDecision',
] as const;

export const importableEntityNameSchema = z.enum(importableEntityNames);
export type ImportableEntityName = z.infer<typeof importableEntityNameSchema>;
