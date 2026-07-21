import z from "zod";
import { issnSchema } from "../validate/journal.schema";
import { Prisma } from "@prisma/client";

export type Issn = z.infer<typeof issnSchema>;

export type JournalWithAffiliatedOrganizationsAndSourceDocument = Prisma.JournalGetPayload<{
    include: {
        affiliations: {
            include: {
                organization: true;
                sourceDocument: true;
            };
        };
    };
}>;