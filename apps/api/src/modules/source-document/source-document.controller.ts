import { Request, Response } from "express";
import { SourceDocumentService } from "./source-document.service";
import { idSchema, idsSchema } from "../../common/validation/schema";
import { sendData } from "../../common/http/response";
import { DtoMapper } from "../../common/types/types";
import { SourceDocumentDto, SourceDocumentEntity } from "./dto/source-document.dto";

export class SourceDocumentController 
{
    constructor(
        private readonly service: SourceDocumentService,
        private readonly mapper: DtoMapper<SourceDocumentEntity, SourceDocumentDto>
    ) {
        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.list = this.list.bind(this);
    }

    async create(req: Request, res: Response): Promise<void>
    {
        const sourceDoc = await this.service.create(
            req.body
        );

        sendData(res, this.mapper(sourceDoc));
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const sourceDoc = await this.service.findById(
            idSchema.parse(req.params.id)
        );

        sendData(res, this.mapper(sourceDoc!));
    }

    async update(req: Request, res: Response): Promise<void>
    {
        const sourceDoc = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );

        sendData(res, this.mapper(sourceDoc))
    }

    async delete(req: Request, res: Response): Promise<void>
    {
        const sourceDoc = await this.service.delete(
            idSchema.parse(req.params.id)
        );
        sendData(res, sourceDoc);
    }

    async deleteMany(req: Request, res: Response): Promise<void>
    {
        const ids = idsSchema.parse(req.params.ids);
        await this.service.deleteMany(ids);
        sendData(res, ids);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const sourceDocs = await this.service.getList(req.listQueryParams);
        const total = await this.service.getCount();
        sendData(
            res, 
            sourceDocs.map(this.mapper),
            { total }
        )
    }
}