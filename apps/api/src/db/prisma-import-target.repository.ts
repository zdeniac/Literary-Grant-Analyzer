import { ImportLookup, ImportRow, ImportWriter } from "../modules/data-import/types/import.types";
import { ModelDelegate } from "./types";

export class PrismaImportTargetRepository<TModel> implements ImportLookup<TModel>, ImportWriter
{
    constructor(
        private readonly delegate: ModelDelegate
    ) {}

    async createMany(data: ImportRow[]): Promise<number>
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