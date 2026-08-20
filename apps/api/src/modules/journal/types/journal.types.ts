import z from "zod";
import { issnSchema, journalSearchableFieldSchema, journalSortableFieldSchema } from "../validate/journal.schema";
import { Prisma } from "@prisma/client";

export type Issn = z.infer<typeof issnSchema>;

export type JournalSortableField = z.infer<typeof journalSortableFieldSchema>;
export type JournalSearchableField = z.infer<typeof journalSearchableFieldSchema>;

export type JournalWithOrganizationsAndSourceDocument = Prisma.JournalGetPayload<{
    include: {
        affiliations: {
            include: {
                organization: true;
                sourceDocument: true;
            };
        };
    };
}>;

export type JournalWithOrganizations = Prisma.JournalGetPayload<{
    include: {
        affiliations: {
            include: {
                organization: true;
            }
        }
    }
}>;