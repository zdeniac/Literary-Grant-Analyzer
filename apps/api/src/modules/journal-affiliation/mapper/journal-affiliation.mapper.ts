import { DtoMapper } from "../../../common/types/types";
import { JournalAffiliationDto, JournalAffiliationEntity } from "../dto/journal-affiliation.dto";

export const toJournalAffiliationDto: DtoMapper<JournalAffiliationEntity, JournalAffiliationDto> = (
    affiliation
) => ({
    id: affiliation.id,
        
    fromYear: affiliation.fromYear,
    toYear: affiliation.toYear,
    note: affiliation.note,
    isCurrent: affiliation.isCurrent,

    journalId: affiliation.journalId,
    organizationId: affiliation.organizationId,
    sourceDocumentId: affiliation.sourceDocumentId,
    
    createdAt: affiliation.createdAt,
    updatedAt: affiliation.updatedAt,
});