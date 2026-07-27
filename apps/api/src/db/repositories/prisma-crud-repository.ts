import { NotFoundError } from "../../common/errors/http.error";
import { CrudRepository, PrismaModel } from "../types";

export class PrismaCrudRepository<TModel, TCreate, TUpdate = Partial<TCreate>>
    implements CrudRepository<TModel, TCreate, TUpdate>
{
    constructor(
        private readonly model: PrismaModel<TModel>,
    ) {}
    
    async create(data: TCreate): Promise<TModel>
    {
        return this.model.create({ data });
    }

    async update(id: number, data: TUpdate): Promise<TModel>
    {
        return this.model.update({
            where: {
                id,
            },
            data
        });
    }

    async findAll(): Promise<TModel[]> {
        return this.model.findMany();
    }

    async findById(id: number): Promise<TModel | null> {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findByIdOrThrow(id: number): Promise<TModel> {
        const entity = await this.findById(id);

        if (!entity) {
            throw new NotFoundError();
        }

        return entity;
    }

    async delete(id: number): Promise<TModel> {
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