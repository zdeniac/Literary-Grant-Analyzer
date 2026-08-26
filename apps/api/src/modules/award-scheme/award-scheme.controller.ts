import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";
import { AwardSchemeService } from "./award-scheme.service";

export class AwardSchemeController
{
    constructor(
        private readonly service: AwardSchemeService,
    ) {
        this.list = this.list.bind(this);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const awardSchemes = await this.service.getList(req.listQueryParams);

        sendData(
            res,
            awardSchemes.map(toAwardSchemeDto),
            {
                total: awardSchemes.length
            }
        );
    }
}