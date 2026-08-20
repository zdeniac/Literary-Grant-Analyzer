import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { JournalService } from "./journal.service";
import { idSchema } from "../../common/validation/schema";
import { DtoMapper } from "../../common/types/types";
import { JournalListDto, JournalWithAffiliationsDto } from "./dto/journal.dto";
import { JournalWithOrganizations, JournalWithOrganizationsAndSourceDocument } from "./types/journal.types";

export class JournalController
{
    constructor(
        private readonly service: JournalService,
        private readonly mapper: DtoMapper<JournalWithOrganizationsAndSourceDocument, JournalWithAffiliationsDto>,
        private readonly listMapper: DtoMapper<JournalWithOrganizations, JournalListDto>
    ) {
        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.list = this.list.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(journal));
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.findByIdWithAffiliations(
            idSchema.parse(req.params.id)
        );

        sendData(res, this.mapper(journal!));
    }

    async update(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );

        sendData(res, this.mapper(journal))
    }

    async delete(req: Request, res: Response): Promise<void>
    {
        await this.service.delete(idSchema.parse(req.params.id));
        res.sendStatus(204);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const journals = await this.service.getList(req.listQueryParams);

        sendData(
            res, 
            journals.map(this.listMapper),
            { total: journals.length }
        )
    }
}