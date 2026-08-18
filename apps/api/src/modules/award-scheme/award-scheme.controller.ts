import { Request, Response } from "express";
import { sendData } from "../../common/http/response";
import { ListQueryParams } from "../../common/types/types";
import { toAwardSchemeDto } from "./mapper/award-scheme.mapper";
import { AwardSchemeSortableField } from "./types/award-scheme.types";
import { awardSchemeSortableFieldSchema } from "./validation/award-scheme.schema";
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
        const query: ListQueryParams<AwardSchemeSortableField> | undefined = req.listQueryParams;
        awardSchemeSortableFieldSchema.parse(query?.sort)

        const awardSchemes = await this.service.getList(query);

        sendData(
            res,
            awardSchemes.map(toAwardSchemeDto),
            {
                total: awardSchemes.length
            }
        );
    }
}