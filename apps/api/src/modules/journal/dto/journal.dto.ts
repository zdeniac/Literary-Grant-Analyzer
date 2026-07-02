import { JournalStatus } from "@prisma/client"
import z from "zod";
import { JournalSchema } from "../validate/journal.schema";
import { Issn } from "../types/journal.types";
import { Id, Name, Year } from "../../../common/types/types";

export type JournalDto = {
    id: Id;
    
    name: Name;
	issn: Issn | null;
	status: JournalStatus;
    foundingYear: Year | null;

    organizationId: Id;

    createdAt: Date;
    updatedAt: Date | null;
}

export type CreateJournalDto = z.infer<typeof JournalSchema>;

export type UpdateJournalDto = {
    name?: Name;
    issn?: Issn;
	status?: JournalStatus;
    foundingYear?: Year;
    organizationId?: Id;
}