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

export interface Repository<T> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
};

export type PrismaModel<T> = {
    create(args: any): Promise<T>;
    findUnique(args: any): Promise<T | null>;
    findMany(args: any): Promise<T[]>;
    update(args: any): Promise<T>;
    delete(args: any): Promise<T>;
    findMany(): Promise<T[]>;
};