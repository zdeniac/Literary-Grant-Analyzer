import { PersonService } from "./person.service";
import { PersonDto, PersonEntity } from "./dto/person.dto";
import { DtoMapper } from "../../common/types/types";
import { sendData } from "../../common/http/response";
import { idSchema, idsSchema } from "../../common/validation/schema";
import { Request, Response } from "express";

export class PersonController
{
    constructor(
        private readonly service: PersonService,
        private readonly mapper: DtoMapper<PersonEntity, PersonDto>
    ) {
        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.list = this.list.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const person = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(person));
    }

    async show(req: Request, res: Response): Promise<void>
    {
        const person = await this.service.findById(
            idSchema.parse(req.params.id)
        );
        sendData(res, this.mapper(person));
    }

    async update(req: Request, res: Response): Promise<void>
    {
        const person = await this.service.update(
            idSchema.parse(req.params.id),
            req.body
        );
        sendData(res, this.mapper(person));
    }

    async delete(req: Request, res: Response): Promise<void> 
    {
        const person = await this.service.delete(
            idSchema.parse(req.params.id)
        );
        sendData(res, person);
    }

    async deleteMany(req: Request, res: Response): Promise<void>
    {
        const ids = idsSchema.parse(req.body.ids);
        await this.service.deleteMany(ids);
        sendData(res, ids);
    }

    async list(req: Request, res: Response): Promise<void>
    {
        const persons = await this.service.getList(req.listQueryParams);
        const total = await this.service.getCount();
        
        sendData(
            res, 
            persons.map(this.mapper),
            { total }
        );
    }
}