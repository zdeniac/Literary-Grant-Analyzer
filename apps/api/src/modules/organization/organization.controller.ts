import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import { idSchema } from "../../common/validation/common.schema";
import { toOrganizationDto } from "./mapper/organization.mapper";
import { DataImportService } from "../dataImport/data-import.service";

export class OrganizationController {
    constructor(
        private readonly service: OrganizationService,
        private readonly importer: DataImportService,
        private readonly model: string = 'organization',
    ) {}

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

    public async import(req: Request, res: Response): Promise<void>
    {
        const totalImported = await this.importer.import(this.model, req.params.file);

        res.json({
            success: true,
            total: totalImported,
        });
    }
}