import z from "zod";
import { prisma } from "../../db/prisma";
import { ImportJournalSchema } from "../journal/validate/journal.schema";
import { OrganizationSchema } from "../organization/validation/organization.schema";
import { Journal, Organization, Prisma } from "@prisma/client";

// Type guard
export function isRelationalBlueprint(
    blueprint: ModelBlueprint
): blueprint is RelationalBlueprint {
    return 'relation' in blueprint;
}

export type RelationalBlueprint = ModelBlueprint & {
    relation: {
        sourceField: string;
        lookupField: string;
        foreignKey: string;
        targetField: string;
    };
    checkRelation: (data: string[]) => Promise<Record<string, unknown>[]>;
};

export type ModelBlueprint = {
    fields: string[];
    schema: z.ZodTypeAny;
    createMany: (data: unknown[]) => Promise<Prisma.BatchPayload>;
};

export const dataImporterBlueprints: Record<string, ModelBlueprint | RelationalBlueprint> = {
    organization: {
        fields: Object.keys(OrganizationSchema.shape),
        schema: OrganizationSchema,
        createMany: async (data: unknown[]) =>
            prisma.organization.createMany({ 
                data: data as Organization[] 
            }),
    },

    journal: {
        fields: Object.keys(ImportJournalSchema.shape),
        schema: ImportJournalSchema,
        createMany: async (data: unknown[]) =>
            prisma.journal.createMany({ 
                data: data as Journal[] 
            }
        ),
        checkRelation: async (data: string[]) =>
            prisma.organization.findMany({
                where: {
                    name: { in: data }
                }
            }
        ),
        relation: {
            sourceField: 'organizationName',
            lookupField: 'name',
            foreignKey: 'organizationId',
            targetField: 'id',
        },
    }
};