import { NotFoundError } from "../../common/errors/http.error";
import { CrudRepositoryInterface, DatabaseCrudDelegate } from "../types";

export class PrismaCrudRepository<TEntity, TCreate, TUpdate = Partial<TCreate>>
    implements CrudRepositoryInterface<TEntity, TCreate, TUpdate>
{
    constructor(
        private readonly model: DatabaseCrudDelegate<TEntity>,
    ) {}
    
    async create(data: TCreate): Promise<TEntity>
    {
        return this.model.create({ data });
    }

    async update(id: number, data: TUpdate): Promise<TEntity>
    {
        return this.model.update({
            where: {
                id,
            },
            data
        });
    }

    async findAll(): Promise<TEntity[]> {
        return this.model.findMany();
    }

    async findById(id: number): Promise<TEntity | null> {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findByIdOrThrow(id: number): Promise<TEntity> {
        const entity = await this.findById(id);

        if (!entity) {
            throw new NotFoundError();
        }

        return entity;
    }

    async delete(id: number): Promise<TEntity> {
        return this.model.delete({
            where: { id }
        });
    }

    async createMany(data: TCreate[]): Promise<number>
    {
        const result = await this.model.createMany({
            data
        });

        return result.count;
    }
}