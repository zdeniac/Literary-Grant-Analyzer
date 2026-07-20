import { JournalOrganization } from "@prisma/client";
import { DtoMapper } from "../../../common/types/types";
import { JournalOrganizationDto } from "../dto/journal-organization.dto";

export const toJournalOrganizationDto: DtoMapper<JournalOrganization, JournalOrganizationDto> = (
    journalOrganization
) => ({
    id: journalOrganization.id,
        
    fromYear: journalOrganization.fromYear,
    toYear: journalOrganization.toYear,
    note: journalOrganization.note,

    journalId: journalOrganization.journalId,
    organizationId: journalOrganization.organizationId,
    sourceDocumentId: journalOrganization.sourceDocumentId,
    
    createdAt: journalOrganization.createdAt,
});