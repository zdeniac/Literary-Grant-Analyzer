import { JournalWithAffiliationsDto } from "../dto/journal.dto";
import { DtoMapper } from "../../../common/types/types";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "../types/journal.types";

export const toJournalWithAffiliationsDto: DtoMapper<
    JournalWithAffiliatedOrganizationsAndSourceDocument, 
    JournalWithAffiliationsDto
> = (journal) => ({
    id: journal.id,

    name: journal.name,
    issn: journal.issn,
    status: journal.status,
    format: journal.format,
    foundingYear: journal.foundingYear,

    affiliations: journal.affiliations.map(affiliation => ({
        id: affiliation.id,

        note: affiliation.note,
        isCurrent: affiliation.isCurrent,
        fromYear: affiliation.fromYear,
        toYear: affiliation.toYear,

        organizationId: affiliation.organizationId,
        organizationName: affiliation.organization.name,
        sourceDocumentName: affiliation.sourceDocument?.title ?? null,
        sourceDocumentId: affiliation.sourceDocumentId,

        journalId: affiliation.journalId,

        createdAt: affiliation.createdAt,
        updatedAt: affiliation.updatedAt,
    })),

    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
});