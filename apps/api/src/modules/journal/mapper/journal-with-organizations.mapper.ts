import { Prisma } from "@prisma/client";
import { JournalWithOrganizationsDto } from "../dto/journal.dto";
import { DtoMapper } from "../../../common/types/types";
import { JournalWithOrganizations } from "../types/journal.types";

export const toJournalWithOrganizationsDto: DtoMapper<JournalWithOrganizations, JournalWithOrganizationsDto> = (
    journal: Prisma.JournalGetPayload<{
        include: {
            organizations: {
                include: {
                    organization: true;
                };
            };
        };
    }>
) => ({
    id: journal.id,

    name: journal.name,
    issn: journal.issn,
    status: journal.status,
    format: journal.format,
    foundingYear: journal.foundingYear,

    organizations: journal.organizations.map(item => ({
        id: item.id,
        organizationId: item.organizationId,
        organizationName: item.organization.name,
        fromYear: item.fromYear,
        toYear: item.toYear,
    })),

    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt,
});