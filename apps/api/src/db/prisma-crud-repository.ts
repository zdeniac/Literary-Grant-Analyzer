import { NotFoundError } from "../common/errors/http.error";
import { PrismaModel, CrudRepository } from "./types";

export abstract class PrismaCrudRepository<TModel, TCreate, TUpdate> 
    implements CrudRepository<TModel, TCreate, TUpdate> 
{
    constructor(
        protected readonly model: PrismaModel<TModel>
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

    async delete(id: number): Promise<void> {
        await this.model.delete({
            where: { id }
        });
    }
}