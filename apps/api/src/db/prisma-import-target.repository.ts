import { ModelDelegate, ImportTargetRepository } from "./types";

export class PrismaImportTargetRepository implements ImportTargetRepository {
    constructor(
        private readonly delegate: ModelDelegate
    ) {}

    public async createMany(data: Record<string, unknown>[]): Promise<number>
    {
        const result = await this.delegate.createMany({
            data
        });

        return result.count;
    }

    public async findManyBy(field: string, values: unknown[]): Promise<Record<string, unknown>[]>
    {
        return this.delegate.findMany({
            where: {
                [field]: {
                    in: values
                }
            }
        });
    }
}