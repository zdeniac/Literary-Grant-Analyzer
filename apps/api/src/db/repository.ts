import { Model } from "./types";

export interface Repository {
    createMany(data: unknown[]): Promise<number>;

    findManyBy(
        field: string,
        values: unknown[]
    ): Promise<Record<string, unknown>[]>;
}

export class PrismaRepository<T extends Record<string, unknown>> implements Repository {
    constructor(
        private readonly model: Model
    ) {}

    public async createMany(data: unknown[]): Promise<number>
    {
        const result = await this.model.createMany({
            data
        });

        return result.count;
    }

    public async findManyBy(field: string, values: unknown[]): Promise<T[]>
    {
        return this.model.findMany({
            where: {
                [field]: {
                    in: values
                }
            }
        });
    }
}