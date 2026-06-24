import { Model, DataImportRepository as DataImportRepo } from "../../db/types";

export class DataImportRepository implements DataImportRepo {
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

    public async findManyBy(field: string, values: unknown[]): Promise<Record<string, unknown>[]>
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