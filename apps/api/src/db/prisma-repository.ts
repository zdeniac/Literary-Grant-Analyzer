import { NotFoundError } from "../common/errors/http.error";
import { PrismaModel, Repository } from "./types";

export abstract class PrismaRepository<T> implements Repository<T> {
    constructor(
        protected readonly model: PrismaModel<T>
    ) {}

    async create(data: Partial<T>): Promise<T>
    {
        return this.model.create({ data });
    }

    async update(id: number, data: Partial<T>): Promise<T>
    {
        return this.model.update({
            where: {
                id,
            },
            data
        });
    }

    async findAll(): Promise<T[]> {
        return this.model.findMany();
    }

    async findById(id: number): Promise<T | null> {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findByIdOrThrow(id: number): Promise<T> {
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