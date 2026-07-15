import { PrismaRepository } from "./prisma-repository";
import { LookupRepository, PrismaModel } from "./types";

export abstract class PrismaLookupRepository<TModel>
    extends PrismaRepository<TModel>
    implements LookupRepository<TModel>
{
    protected abstract get model(): PrismaModel<TModel>;

    async findManyBy(field: string, values: unknown[]): Promise<TModel[]>
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