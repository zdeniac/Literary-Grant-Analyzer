import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { JournalService } from "./journal.service";
import { idSchema } from "../../common/validation/schema";
import { toJournalWithAffiliationsDto } from "./mapper/journal-with-affiliations.mapper";
import { toJournalListDto } from "./mapper/journal-list-mapper";

export class JournalController
{
    constructor(
        private readonly service: JournalService,
    ) {
        this.create = this.create.bind(this);
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
    }

    async create(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.create(
            req.body
        );

        sendData(res, toJournalWithAffiliationsDto(journal));
    }

    async findAll(req: Request, res: Response): Promise<void>
    {
        const journals = await this.service.findAllWithOrganizations();

        sendData(
            res, 
            journals.map(toJournalListDto),
            { total: journals.length }
        )
    }

    async findById(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.findByIdWithAffiliations(
            idSchema.parse(req.params.id)
        );

        sendData(res, toJournalWithAffiliationsDto(journal!));
    }

    async update(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );

        sendData(res, toJournalWithAffiliationsDto(journal))
    }
}