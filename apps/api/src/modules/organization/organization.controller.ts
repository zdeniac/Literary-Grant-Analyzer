import { OrganizationService } from "./organization.service";
import { OrganizationDto, OrganizationModel } from "./dto/organization.dto";
import { DtoMapper } from "../../common/types/types";
import { sendData } from "../../common/http/response";
import { idSchema } from "../../common/validation/schema";
import { Request, Response } from "express";

export class OrganizationController
{
    constructor(
        private readonly service: OrganizationService,
        private readonly mapper: DtoMapper<OrganizationModel, OrganizationDto>
    ) {
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const organization = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(organization));
    }

    async delete(req: Request, res: Response): Promise<void> 
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );
        res.sendStatus(204);
    }
}