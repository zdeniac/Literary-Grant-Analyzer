import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { DtoMapper } from "../../common/types/types";
import { idSchema, idsSchema } from "../../common/validation/schema";
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
        this.deleteMany = this.deleteMany.bind(this);
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
        const awardDecision = await this.service.delete(
            idSchema.parse(req.params.id)
        );
        sendData(res, awardDecision);
    }

    async deleteMany(req: Request, res: Response): Promise<void> 
    {
        const ids = idsSchema.parse(req.body.ids);

        await this.service.deleteMany(ids);
        
        sendData(res, ids);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const awardDecisions = await this.service.getList(req.listQueryParams);
        sendData(
            res,
            awardDecisions.map(this.withRelatedDataMapper),
            {
                total: await this.service.getTotalCount()
            }
        );
    }

}