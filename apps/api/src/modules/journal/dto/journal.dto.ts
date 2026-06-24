import { JournalStatus } from "@prisma/client"
import z from "zod";
import { JournalSchema } from "../validate/journal.schema";

export type JournalDto = {
    id: number;
    name: string;
	issn: string | null;
	status: JournalStatus;
    foundingYear: number | null;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export type CreateJournalDto = z.infer<typeof JournalSchema>;

export type UpdateJournalDto = {
    name?: string;
    issn?: string;
	status?: JournalStatus;
    foundingYear?: number;
    organizationId?: number;
}