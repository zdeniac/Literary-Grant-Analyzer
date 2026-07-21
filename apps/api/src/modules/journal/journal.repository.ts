import { PrismaDatabase } from "../../db/types";
import { CreateJournalWithAffiliationsInput } from "./dto/journal.dto";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "./types/journal.types";
import { Id } from "../../common/types/types";

export class JournalRepository
{
    constructor(
        private readonly model: PrismaDatabase['journal']
    ) {}
    
    async createWithAffiliations(dto: CreateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
    {
        return this.model.create({
            data: {
                name: dto.name,
                status: dto.status,
                issn: dto.issn,
                format: dto.format,
                foundingYear: dto.foundingYear,

                affiliations: {
                    create: dto.affiliations.map(affiliation => ({
                        organization: {
                            connect: {
                                id: affiliation.organizationId
                            }
                        },

                        sourceDocumentId: affiliation.sourceDocumentId,
                        note: affiliation.note,
                        isCurrent: affiliation.isCurrent,
                        fromYear: affiliation.fromYear,
                        toYear: affiliation.toYear
                    }))
                },      
            },
            include: {
                affiliations: {
                    include: {
                        organization: true,
                        sourceDocument: true,
                    }
                }
            }
        });
    }

    async findById(id: Id): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
    {
        return this.model.findUniqueOrThrow({
            where: {
                id
            },
            include: {
                affiliations: {
                    include: {
                        organization: true,
                        sourceDocument: true,
                    }
                }
            }
        });
    }
}