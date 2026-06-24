import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import { idSchema } from "../../common/validation/common.schema";
import { toOrganizationDto } from "./mapper/organization.mapper";

export class OrganizationController {
    constructor(
        private readonly service: OrganizationService,
    ) {
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async findById(req: Request, res: Response): Promise<void>
    {
        const org = await this.service.findById(
            idSchema.parse(req.params.id)
        );

        res.json({
            data: toOrganizationDto(org)
        });
    }

    public async findAll(req: Request, res: Response): Promise<void>
    {
        const orgs = (await this.service.findAll())
            .map(toOrganizationDto);

        res.json({
            data: orgs,
            total: orgs.length,
        });
    }

    public async create(req: Request, res: Response): Promise<void>
    {
        const org = await this.service.create(
            req.body
        );

        res.json({
            data: toOrganizationDto(org)
        });
    }

    public async update(req: Request, res: Response): Promise<void>
    {
        const org = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );

        res.json({
            data: toOrganizationDto(org)
        });
    }

    public async delete(req: Request, res: Response): Promise<void>
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );

        res.sendStatus(204);
    }
}