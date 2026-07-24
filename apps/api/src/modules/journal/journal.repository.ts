import { PrismaDatabase } from "../../db/types";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "./types/journal.types";
import { Id } from "../../common/types/types";
import { CreateJournalInput, CreateJournalWithAffiliationsInput } from "./dto/journal.input.dto";
import { NotFoundError } from "../../common/errors/http.error";
import { Journal } from "@prisma/client";

export class JournalRepository
{
    constructor(
        private readonly model: PrismaDatabase['journal']
    ) {}

    async create(data: CreateJournalInput): Promise<Journal>
    {
        return this.model.create({ data });
    }
    
    async createWithAffiliations(input: CreateJournalWithAffiliationsInput): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
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

    async update(id: Id, data: Partial<Pick<JournalWithAffiliatedOrganizationsAndSourceDocument, 'name' | 'status' | 'issn' | 'format' | 'foundingYear'>>): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
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

    async findByIdWithAffiliations(id: Id): Promise<JournalWithAffiliatedOrganizationsAndSourceDocument>
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
}