import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { AwardSchemeService } from "./award-scheme.service";
import { idSchema, idsSchema } from "../../common/validation/schema";
import { AwardSchemeDto, AwardSchemeEntity } from "./dto/award-scheme.dto";
import { DtoMapper } from "../../common/types/types";

export class AwardSchemeController
{
    constructor(
        private readonly service: AwardSchemeService,
        private readonly mapper: DtoMapper<AwardSchemeEntity, AwardSchemeDto>
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
        const awardScheme = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(awardScheme));
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const awardScheme = await this.service.findById(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(awardScheme));
    }

    async update(req: Request, res: Response): Promise<void>
    {
        const awardScheme = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, this.mapper(awardScheme));
    }

    async delete(req: Request, res: Response): Promise<void>
    {
        const awardScheme = await this.service.delete(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(awardScheme));
    }

    async deleteMany(req: Request, res: Response): Promise<void>
    {
        const ids = idsSchema.parse(req.body.ids);
        await this.service.deleteMany(ids);
        sendData(res, ids);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const awardSchemes = await this.service.getList(req.listQueryParams);
        const total = await this.service.getCount();
        sendData(
            res,
            awardSchemes.map(this.mapper),
            { total }
        );
    }
}