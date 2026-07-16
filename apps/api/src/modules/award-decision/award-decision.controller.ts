import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { DtoMapper } from "../../common/types/types";
import { idSchema } from "../../common/validation/schema";
import { AwardDecisionService } from "./award-decision.service";
import { AwardDecisionWithActorsDto } from "./dto/award-decision.dto";
import { AwardDecisionWithRelations } from "./types/award-decision.types";

export class AwardDecisionController
{
    constructor(
        private readonly service: AwardDecisionService,
        private readonly mapper: DtoMapper<AwardDecisionWithRelations, AwardDecisionWithActorsDto>
    ) {
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
    }

    async findAll(req: Request, res: Response): Promise<void>
    {
        const entities = await this.service.findAllWithActors();

        sendData(
            res,
            entities.map(this.mapper),
            {
                total: entities.length
            }
        );
    }

    async findById(req: Request, res: Response): Promise<void>
    {
        const entity = await this.service.findByIdWithActors(
            idSchema.parse(req.params.id)
        );

        sendData(res, this.mapper(entity));
    }
}