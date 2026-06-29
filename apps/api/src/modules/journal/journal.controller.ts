import { Request, Response } from "express";
import { JournalService } from "./journal.service";
import { idSchema } from "../../common/validation/schema";
import { toJournalDto } from "./mapper/journal.mapper";
import { sendData } from "../../common/http/response";

export class JournalController {
    constructor(
        private readonly service: JournalService,
    ) {
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async findById(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.findById(
            idSchema.parse(req.params.id)
        );
        sendData(res, toJournalDto(journal))
    }

    public async findAll(req: Request, res: Response): Promise<void>
    {
        const journal = (await this.service.findAll())
            .map(toJournalDto);
        sendData(res, journal, {
            total: journal.length
        });
    }

    public async create(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.create(
            req.body
        );
        sendData(res, toJournalDto(journal))
    }

    public async update(req: Request, res: Response): Promise<void>
    {
        const journal = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, toJournalDto(journal))
    }

    public async delete(req: Request, res: Response): Promise<void>
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );
        res.sendStatus(204);
    }
}