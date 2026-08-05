import { DtoMapper } from "../../common/types/types";
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
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const decisionAuthority = await this.service.create(
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
}