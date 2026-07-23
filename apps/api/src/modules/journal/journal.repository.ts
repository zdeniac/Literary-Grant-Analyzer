import { PrismaDatabase } from "../../db/types";
import {  } from "./dto/journal.dto";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "./types/journal.types";
import { Id } from "../../common/types/types";
import { CreateJournalWithAffiliationsInput } from "./dto/journal.input.dto";
import { NotFoundError } from "../../common/errors/http.error";

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