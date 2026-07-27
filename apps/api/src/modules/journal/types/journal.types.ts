import z from "zod";
import { issnSchema } from "../validate/journal.schema";
import { Prisma } from "@prisma/client";

export type Issn = z.infer<typeof issnSchema>;

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