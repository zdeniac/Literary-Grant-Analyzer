export type Model = {
    createMany: (args: any) => Promise<{ count: number }>;
    findMany: (args: any) => Promise<any[]>;
};

export interface Repository {
    createMany(data: unknown[]): Promise<number>;
    findManyBy(
        field: string,
        values: unknown[]
    ): Promise<Record<string, unknown>[]>;
}