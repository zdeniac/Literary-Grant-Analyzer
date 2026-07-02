export type ModelDelegate = {
    createMany: (args: any) => Promise<{ count: number }>;
    findMany: (args: any) => Promise<any[]>;
};

export interface ImportTargetRepository {
    createMany(data: Record<string, unknown>[]): Promise<number>;
    findManyBy(
        field: string,
        values: unknown[]
    ): Promise<Record<string, unknown>[]>;
};

export interface CrudRepository<TModel, TCreate, TUpdate> {
    findById(id: number): Promise<TModel | null>;
    findAll(): Promise<TModel[]>;
    create(data: TCreate): Promise<TModel>;
    delete(id: number): Promise<void>;
    findByIdOrThrow(id: number): Promise<TModel>;
    update(id: number, data: TUpdate): Promise<TModel>;
};

export type PrismaModel<T> = {
    create(args: any): Promise<T>;
    findUnique(args: any): Promise<T | null>;
    findMany(args: any): Promise<T[]>;
    update(args: any): Promise<T>;
    delete(args: any): Promise<T>;
    findMany(): Promise<T[]>;
};