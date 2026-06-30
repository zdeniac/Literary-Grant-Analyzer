import { Request, Response } from "express";
import { sendData } from "../http/response";
import { idSchema } from "../validation/schema";
import { CrudService, Mapper } from "../types/types";

export abstract class CrudController<TModel, TDto> {
    constructor(
        protected readonly service: CrudService<TModel>,
        protected readonly mapper: Mapper<TModel, TDto>,
    ) {
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async findById(req: Request, res: Response): Promise<void> 
    {
        const entity = await this.service.findById(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(entity));
    }


    public async findAll(req: Request, res: Response): Promise<void> 
    {
        const entities = (await this.service.findAll())
            .map(this.mapper);
        sendData(res, entities, {
            total: entities.length
        });
    }

    public async create(req: Request, res: Response): Promise<void> 
    {
        const entity = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(entity));
    }

    public async update(req: Request, res: Response): Promise<void> 
    {
        const entity = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, this.mapper(entity));
    }

    public async delete(req: Request, res: Response): Promise<void> 
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );

        res.sendStatus(204);
    }
}