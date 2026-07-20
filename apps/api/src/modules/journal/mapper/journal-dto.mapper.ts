import { Journal } from "@prisma/client";
import { JournalDto} from "../dto/journal.dto";
import { DtoMapper } from "../../../common/types/types";

export const toJournalDto: DtoMapper<Journal, JournalDto> = (
    journal
) => ({
    id: journal.id,

    name: journal.name,
    issn: journal.issn,
    status: journal.status,
    format: journal.format,
    foundingYear: journal.foundingYear,
    
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
});