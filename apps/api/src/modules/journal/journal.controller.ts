import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { DtoMapper } from "../../common/types/types";
import { JournalService } from "./journal.service";
import { JournalWithAffiliationsDto } from "./dto/journal.dto";
import { JournalWithAffiliatedOrganizationsAndSourceDocument } from "./types/journal.types";
import { idSchema } from "../../common/validation/schema";

export class JournalController
{
    constructor(
        private readonly service: JournalService,
        private readonly mapper: DtoMapper<JournalWithAffiliatedOrganizationsAndSourceDocument, JournalWithAffiliationsDto>
    ) {
        this.create = this.create.bind(this);
        this.findById = this.findById.bind(this);
    }

    async create(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.create(
            this.mapper(req.body.data)
        );

        sendData(res, journal);
    }

    async findById(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.findByIdWithOrganizations(
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
}