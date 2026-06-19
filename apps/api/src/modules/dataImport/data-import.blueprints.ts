import z from "zod";
import { prisma } from "../../db/prisma";
import { JournalSchema } from "../journal/validate/journal.schema";
import { OrganizationSchema } from "../organization/validation/organization.schema";
import { Journal, Organization, Prisma } from "@prisma/client";

export type ModelBlueprint = {
    fields: string[];
    schema: z.ZodTypeAny;
    createMany: (data: unknown[]) => Promise<Prisma.BatchPayload>;
};

export const dataImporterBlueprints: Record<string, ModelBlueprint> = {
    organization: {
        fields: Object.keys(OrganizationSchema.shape),
        schema: OrganizationSchema,
        createMany: (data: unknown[]) =>
            prisma.organization.createMany({ 
                data: data as Organization[] 
            }),
    },

    journal: {
        fields: Object.keys(JournalSchema.shape),
        schema: JournalSchema,
        createMany: (data: unknown[]) =>
            prisma.journal.createMany({ 
                data: data as Journal[] 
            }),
    },
};