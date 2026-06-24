export type Model = {
    createMany: (args: any) => Promise<{ count: number }>;
    findMany: (args: any) => Promise<any[]>;
};

export interface DataImportRepository {
    createMany(data: unknown[]): Promise<number>;
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