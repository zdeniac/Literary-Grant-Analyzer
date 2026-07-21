import { DtoMapper } from "../../common/types/types";
import { DecisionBodyService } from "./decision-body.service";
import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { idSchema } from "../../common/validation/schema";
import { DecisionBodyDto, DecisionBodyModel } from "./dto/decision-body.dto";

export class DecisionBodyController
{
    constructor(
        private readonly service: DecisionBodyService,
        private readonly mapper: DtoMapper<DecisionBodyModel, DecisionBodyDto>
    ) {
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const entity = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(entity));
    }

    async delete(req: Request, res: Response): Promise<void> 
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );
        res.sendStatus(204);
    }
}