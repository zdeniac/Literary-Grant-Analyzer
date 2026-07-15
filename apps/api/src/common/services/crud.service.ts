import { CrudRepository } from "../../db/types";
import { Id } from "../types/types";

export abstract class CrudService<TModel, TCreateDto, TUpdateDto>
{
    constructor(
        protected readonly repository: CrudRepository<TModel, TCreateDto, TUpdateDto>
    ) {}

    public async create(dto: TCreateDto): Promise<TModel>
    {   
        return this.repository.create(dto);
    }

    public async findById(id: Id): Promise<TModel>
    {
        return this.repository.findByIdOrThrow(id);
    }

    public async findAll(): Promise<TModel[]>
    {
        return this.repository.findAll();
    }

    public async update(id: Id, dto: TUpdateDto): Promise<TModel>
    {
        return this.repository.update(id, dto);
    }

    public async delete(id: Id): Promise<TModel>
    {
        return this.repository.delete(id);
    }
}