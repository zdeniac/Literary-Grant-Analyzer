import { DtoMapper, ListQueryParams } from "../../common/types/types";
import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { idSchema } from "../../common/validation/schema";
import { DecisionAuthorityService } from "./decision-authority.service";
import { DecisionAuthorityDto, DecisionAuthorityEntity } from "./dto/decision-authority.dto";

export class DecisionAuthorityController
{
    constructor(
        private readonly service: DecisionAuthorityService,
        private readonly mapper: DtoMapper<DecisionAuthorityEntity, DecisionAuthorityDto>
    ) {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.show = this.show.bind(this);
        this.list = this.list.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const decisionAuthority = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(decisionAuthority));
    }

    async show(req: Request, res: Response): Promise<void> 
    {
        const decisionAuthority = await this.service.findById(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(decisionAuthority));
    }

    async update(req: Request, res: Response): Promise<void> 
    {
        const decisionAuthority = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, this.mapper(decisionAuthority));
    }

    async delete(req: Request, res: Response): Promise<void> 
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );
        res.sendStatus(204);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const decisionAuths = await this.service.getList(req.listQueryParams);
        
        sendData(res, decisionAuths.map(this.mapper));
    }
}