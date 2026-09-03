import { NotFoundError } from "../../common/errors/http.error";
import { CrudRepositoryInterface, DatabaseCrudDelegate } from "../types";

export class PrismaCrudRepository<TEntity, TCreate, TUpdate = Partial<TCreate>>
    implements CrudRepositoryInterface<TEntity, TCreate, TUpdate>
{
    constructor(
        private readonly entity: DatabaseCrudDelegate<TEntity>,
    ) {}
    
    async create(data: TCreate): Promise<TEntity>
    {
        return this.entity.create({ data });
    }

    async update(id: number, data: TUpdate): Promise<TEntity>
    {
        return this.entity.update({
            where: {
                id,
            },
            data
        });
    }

    async findAll(): Promise<TEntity[]>
    {
        return this.entity.findMany();
    }

    async findById(id: number): Promise<TEntity | null> 
    {
        return this.entity.findUnique({
            where: { id }
        });
    }

    async findByIdOrThrow(id: number): Promise<TEntity> 
    {
        const entity = await this.findById(id);

        if (!entity) {
            throw new NotFoundError();
        }

        return entity;
    }

    async delete(id: number): Promise<TEntity> 
    {
        return this.entity.delete({
            where: { id }
        });
    }

    async deleteMany(ids: number[]): Promise<number>
    {
        const result = await this.entity.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        return result.count;
    }

    async createMany(data: TCreate[]): Promise<number>
    {
        const result = await this.entity.createMany({
            data
        });

        return result.count;
    }

    async count(): Promise<number>
    {
        return this.entity.count();
    }
}