import { PersonService } from "./person.service";
import { PersonDto, PersonModel } from "./dto/person.dto";
import { DtoMapper } from "../../common/types/types";
import { sendData } from "../../common/http/response";
import { idSchema } from "../../common/validation/schema";
import { Request, Response } from "express";

export class PersonController
{
    constructor(
        private readonly service: PersonService,
        private readonly mapper: DtoMapper<PersonModel, PersonDto>
    ) {
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> 
    {
        const person = await this.service.create(
            req.body
        );
        sendData(res, this.mapper(person));
    }

    async delete(req: Request, res: Response): Promise<void> 
    {
        await this.service.delete(
            idSchema.parse(req.params.id)
        );
        res.sendStatus(204);
    }
}