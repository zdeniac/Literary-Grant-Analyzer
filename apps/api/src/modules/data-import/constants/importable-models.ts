import z from "zod";

export const importableModelNames = [
    'journal',
    'organization',
    'awardScheme',
    'decisionAuthority',
    'awardDecision',
] as const;

export const importableModelNameSchema = z.enum(importableModelNames);
export type ImportableModelName = z.infer<typeof importableModelNameSchema>;
