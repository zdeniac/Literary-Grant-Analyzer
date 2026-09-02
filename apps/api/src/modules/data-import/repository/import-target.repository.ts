import { ImportLookupInterface, LookupQueryOptions } from "../types/import-lookup.types";
import { DatabaseDelegate } from "../../../db/types";
import { ImportWriterInterface } from "../types/service.types";

export class ImportTargetRepository<TEntity, TCreate> 
    implements ImportLookupInterface<TEntity>, ImportWriterInterface<TCreate>
{
    constructor(
        private readonly delegate: DatabaseDelegate<TEntity>
    ) {}

    async create(data: TCreate): Promise<TEntity>
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

    async findManyBy(field: string, values: unknown[], options?: LookupQueryOptions): Promise<TEntity[]>
    {
        const filteredValues = values.filter(value => value !== undefined);

        if (!filteredValues.length) {
            return [];
        }

        const whereValue: any = options?.type === 'array'
            ? { hasSome: filteredValues }
            : { in: filteredValues};

        if (options?.mode) {
            whereValue.mode = options.mode;
        }

        return this.delegate.findMany({
            where: {
                [field]: whereValue
            }
        });
    }
}