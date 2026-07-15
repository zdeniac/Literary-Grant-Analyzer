import { PrismaDatabase, PrismaModel } from "./types";

export abstract class PrismaRepository<TModel>
{
    constructor(
        protected readonly db: PrismaDatabase
    ) {}
    
    protected abstract get model(): PrismaModel<TModel>;

    withClient(client: PrismaDatabase): this 
    {
        return new (this.constructor as any)(client);
    }
}