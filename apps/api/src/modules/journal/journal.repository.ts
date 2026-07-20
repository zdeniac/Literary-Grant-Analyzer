import { PrismaDatabase } from "../../db/types";
import { CreateJournalWithOrganizationsInput } from "./dto/journal.dto";
import { JournalWithOrganizations } from "./types/journal.types";
import { Id } from "../../common/types/types";

export class JournalRepository
{
    constructor(
        private readonly model: PrismaDatabase['journal']
    ) {}
    
    async createWithOrganizations(dto: CreateJournalWithOrganizationsInput): Promise<JournalWithOrganizations>
    {
        return this.model.create({
            data: {
                name: dto.name,
                status: dto.status,
                issn: dto.issn,
                format: dto.format,
                foundingYear: dto.foundingYear,

                organizations: {
                    create: dto.organizations.map(org => ({
                        organization: {
                            connect: {
                                id: org.organizationId
                            }
                        },

                        sourceDocumentId: org.sourceDocumentId,
                        note: org.note,
                        fromYear: org.fromYear,
                        toYear: org.toYear
                    }))
                },      
            },
            include: {
                organizations: {
                    include: {
                        organization: true
                    }
                }
            }
        });
    }

    async findById(id: Id): Promise<JournalWithOrganizations>
    {
        return this.model.findUniqueOrThrow({
            where: {
                id
            },
            include: {
                organizations: {
                    include: {
                        organization: true
                    }
                }
            }
        });
    }
}