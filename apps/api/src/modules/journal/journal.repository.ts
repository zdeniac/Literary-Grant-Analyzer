import { Database } from "../../db/types";
import { JournalWithOrganizations, JournalWithOrganizationsAndSourceDocument } from "./types/journal.types";
import { Id } from "../../common/types/types";
import { CreateJournalInput, CreateJournalWithAffiliationsInput } from "./dto/journal.input.dto";
import { NotFoundError } from "../../common/errors/http.error";
import { JournalEntity } from "./dto/journal.dto";

export class JournalRepository
{
    constructor(
        private readonly entity: Database['journal']
    ) {}

    async create(data: CreateJournalInput): Promise<JournalEntity>
    {
        return this.entity.create({ data });
    }

    async delete(id: Id): Promise<JournalEntity>
    {
        return this.entity.delete({ 
            where : { 
                id 
            } 
        })
    }
    
    async createWithAffiliations(input: CreateJournalWithAffiliationsInput): Promise<JournalWithOrganizationsAndSourceDocument>
    {
        return this.entity.create({
            data: {
                name: input.name,
                status: input.status,
                issn: input.issn,
                format: input.format,
                foundingYear: input.foundingYear,

                affiliations: {
                    create: input.affiliations.map(affiliation => ({
                        organization: {
                            connect: {
                                id: affiliation.organizationId
                            }
                        },
                        
                        sourceDocumentId: affiliation.sourceDocumentId,
                        note: affiliation.note,
                        isCurrent: affiliation.isCurrent,
                        fromYear: affiliation.fromYear,
                        toYear: affiliation.toYear,
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

    async updateWithOrganizationsAndSourceDocument(id: Id, data: Partial<Pick<JournalWithOrganizationsAndSourceDocument, 'name' | 'status' | 'issn' | 'format' | 'foundingYear'>>): Promise<JournalWithOrganizationsAndSourceDocument>
    {
        return this.entity.update({
            where: { id },
            data,
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

    async findByIdWithOrganizationsAndSourceDocument(id: Id): Promise<JournalWithOrganizationsAndSourceDocument>
    {
        const journal = await this.entity.findUnique({
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

        if (!journal) {
            throw new NotFoundError();
        }

        return journal;
    }

    async findAllWithOrganizations(): Promise<JournalWithOrganizations[]>
    {
        return this.entity.findMany({
            include: {
                affiliations: {
                    include: {
                        organization: true,
                    }
                }
            },
        });
    }
}