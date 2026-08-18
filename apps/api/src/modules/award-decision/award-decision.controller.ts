import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { DtoMapper } from "../../common/types/types";
import { idSchema } from "../../common/validation/schema";
import { AwardDecisionService } from "./award-decision.service";
import { AwardDecisionWithRelatedDataDto } from "./dto/award-decision.dto";
import { AwardDecisionEntityWithRelatedData } from "./types/award-decision.types";

export class AwardDecisionController
{
    constructor(
        private readonly service: AwardDecisionService,
        private readonly mapper: DtoMapper<AwardDecisionEntityWithRelatedData, AwardDecisionWithRelatedDataDto>
    ) {
        this.list = this.list.bind(this);
        this.show = this.show.bind(this);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const awardDecisions = await this.service.getList(req.listQueryParams);

        sendData(
            res,
            awardDecisions.map(this.mapper),
            {
                total: awardDecisions.length
            }
        );
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const awardDecision = await this.service.findByIdWithRelations(
            idSchema.parse(req.params.id)
        );

        sendData(res, this.mapper(awardDecision));
    }
}