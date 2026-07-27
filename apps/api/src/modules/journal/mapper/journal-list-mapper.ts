import { DtoMapper } from "../../../common/types/types";
import { JournalListDto } from "../dto/journal.dto";
import { JournalWithOrganizations } from "../types/journal.types";

export const toJournalListDto: DtoMapper<JournalWithOrganizations, JournalListDto> = (journal) => ({
    id: journal.id,

    name: journal.name,
    issn: journal.issn,
    status: journal.status,
    format: journal.format,
    foundingYear: journal.foundingYear,
    
    organizations: journal.affiliations.map(
        affiliation => ({
            id: affiliation.organization.id,
            name: affiliation.organization.name,
        })
    ),

    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
});