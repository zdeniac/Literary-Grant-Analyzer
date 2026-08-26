import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { DtoMapper } from "../../common/types/types";
import { idSchema } from "../../common/validation/schema";
import { AwardDecisionService } from "./award-decision.service";
import { AwardDecisionDto, AwardDecisionWithRelatedDataDto } from "./dto/award-decision.dto";
import { AwardDecisionEntity, AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionController
{
    constructor(
        private readonly service: AwardDecisionService,
        private readonly mapper: DtoMapper<AwardDecisionEntity, AwardDecisionDto>,
        private readonly withRelatedDataMapper: DtoMapper<AwardDecisionEntityWithRelatedData, AwardDecisionWithRelatedDataDto>
    ) {
        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.show.bind(this);
        this.list = this.list.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const awardDecision = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(awardDecision));
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const awardDecision = await this.service.findByIdWithRelations(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(awardDecision));
    }

    async update(req: Request, res: Response): Promise<void> 
    {
        const awardDecision = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, this.mapper(awardDecision));
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
        const awardDecisions = await this.service.getList(req.listQueryParams);
        sendData(
            res,
            awardDecisions.map(this.withRelatedDataMapper),
            {
                total: awardDecisions.length
            }
        );
    }

}