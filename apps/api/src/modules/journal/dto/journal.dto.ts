import { JournalStatus } from "@prisma/client"

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

export type CreateJournalDto = {
    name: string;
	issn?: string;
	status: JournalStatus;
    foundingYear?: number;
    organizationId: number;
};

export type UpdateJournalDto = {
    name?: string;
    issn?: string;
	status?: JournalStatus;
    foundingYear?: number;
    organizationId?: number;
}