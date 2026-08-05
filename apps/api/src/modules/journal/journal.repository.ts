import { Database } from "../../db/types";
import { JournalWithOrganizations, JournalWithOrganizationsAndSourceDocument } from "./types/journal.types";
import { Id } from "../../common/types/types";
import { CreateJournalInput, CreateJournalWithAffiliationsInput } from "./dto/journal.input.dto";
import { NotFoundError } from "../../common/errors/http.error";
import { Journal } from "@prisma/client";

export class JournalRepository
{
    constructor(
        private readonly model: Database['journal']
    ) {}

    async create(data: CreateJournalInput): Promise<Journal>
    {
        return this.model.create({ data });
    }
    
    async createWithAffiliations(input: CreateJournalWithAffiliationsInput): Promise<JournalWithOrganizationsAndSourceDocument>
    {
        return this.model.create({
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
        return this.model.update({
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
        const journal = await this.model.findUnique({
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
        return this.model.findMany({
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