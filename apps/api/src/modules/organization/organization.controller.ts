import { OrganizationService } from "./organization.service";
import { OrganizationDto, OrganizationEntity } from "./dto/organization.dto";
import { DtoMapper } from "../../common/types/types";
import { sendData } from "../../common/http/response";
import { idSchema, idsSchema } from "../../common/validation/schema";
import { Request, Response } from "express";

export class OrganizationController
{
    constructor(
        private readonly service: OrganizationService,
        private readonly mapper: DtoMapper<OrganizationEntity, OrganizationDto>
    ) {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.show = this.show.bind(this);
        this.list = this.list.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const organization = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(organization));
    }

    async show(req: Request, res: Response): Promise<void> 
    {
        const organization = await this.service.findById(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(organization));
    }

    async update(req: Request, res: Response): Promise<void> 
    {
        const organization = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, this.mapper(organization));
    }

    async delete(req: Request, res: Response): Promise<void> 
    {
        const organization = await this.service.delete(
            idSchema.parse(req.params.id)
        );
        sendData(res, organization);
    }

    async deleteMany(req: Request, res: Response): Promise<void>
    {
        const ids = idsSchema.parse(req.params.ids);

        await this.service.deleteMany(ids);

        sendData(res, ids);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const organizations = await this.service.getList(req.listQueryParams);
        sendData(
            res, 
            organizations.map(this.mapper), 
            { 
                total: organizations.length 
            }
        );
    }
}