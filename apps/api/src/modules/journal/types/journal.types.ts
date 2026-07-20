import z from "zod";
import { issnSchema } from "../validate/journal.schema";
import { Prisma } from "@prisma/client";

export type Issn = z.infer<typeof issnSchema>;

export type JournalWithOrganizations = Prisma.JournalGetPayload<{
    include: {
        organizations: {
            include: {
                organization: true;
            };
        };
    };
}>;