import { JournalFormat, JournalStatus } from "@prisma/client"
import z from "zod";
import { JournalSchema } from "../validate/journal.schema";
import { Issn } from "../types/journal.types";
import { Id, Name, Year } from "../../../common/types/types";

export type JournalDto = {
    id: Id;
    
    name: Name;
	issn: Issn | null;
	status: JournalStatus;
    format: JournalFormat[];
    foundingYear: Year | null;

    organizationId: Id;

    createdAt: Date;
    updatedAt: Date | null;
}

export type CreateJournalDto = z.infer<typeof JournalSchema>;

export type UpdateJournalDto = Partial<JournalDto>;