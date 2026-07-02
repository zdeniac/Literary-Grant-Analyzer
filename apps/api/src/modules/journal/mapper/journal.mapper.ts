import { Journal } from "@prisma/client";
import { JournalDto } from "../dto/journal.dto";
import { DtoMapper } from "../../../common/types/types";

export const toJournalDto: DtoMapper<Journal, JournalDto> = (
    journal
) => ({
    id: journal.id,
    
    name: journal.name,
    issn: journal.issn,
    status: journal.status,
    foundingYear: journal.foundingYear,
    
    organizationId: journal.organizationId,

    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
});