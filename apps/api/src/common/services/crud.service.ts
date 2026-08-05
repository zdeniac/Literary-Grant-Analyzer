import { CrudRepositoryInterface } from "../../db/types";
import { CrudServiceInterface, Id } from "../types/types";

export class CrudService<TEntity, TCreateDto, TUpdateDto = Partial<TCreateDto>> 
    implements CrudServiceInterface<TEntity, TCreateDto, TUpdateDto>
{
    constructor(
        private readonly repository: CrudRepositoryInterface<TEntity, TCreateDto, TUpdateDto>
    ) {}

    public async create(dto: TCreateDto): Promise<TEntity>
    {   
        return this.repository.create(dto);
    }

    public async findById(id: Id): Promise<TEntity>
    {
        return this.repository.findByIdOrThrow(id);
    }

    public async findAll(): Promise<TEntity[]>
    {
        return this.repository.findAll();
    }

    public async update(id: Id, dto: TUpdateDto): Promise<TEntity>
    {
        return this.repository.update(id, dto);
    }

    public async delete(id: Id): Promise<TEntity>
    {
        return this.repository.delete(id);
    }
}