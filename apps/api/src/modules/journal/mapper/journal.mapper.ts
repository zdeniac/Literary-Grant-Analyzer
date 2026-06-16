import { Journal } from "@prisma/client";
import { JournalDto } from "../dto/journal.dto";

export const toJournalDto = (journal: Journal): JournalDto => ({
    id: journal.id,
    name: journal.name,
    issn: journal.issn,
    status: journal.status,
    foundingYear: journal.foundingYear,
    
    organizationId: journal.organizationId,

    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
});