import { ImportLookupInterface, ImportWriterInterface } from "../types/import.types";
import { ModelDelegate } from "../../../db/types";

export class ImportTargetRepository<TModel, TCreate> implements ImportLookupInterface<TModel>, ImportWriterInterface<TCreate>
{
    constructor(
        private readonly delegate: ModelDelegate<TModel>
    ) {}

    async create(data: TCreate): Promise<TModel>
    {
        return this.delegate.create({
            data,
        });
    }

    async createMany(data: TCreate[]): Promise<number>
    {
        const result = await this.delegate.createMany({
            data
        });

        return result.count;
    }

    async findManyBy(field: string, values: unknown[]): Promise<TModel[]>
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