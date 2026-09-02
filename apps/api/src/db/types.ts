import { Prisma, PrismaClient } from "@prisma/client";
import { ListOrder, SortableField } from "../common/types/types";

export type ListDbQueryOptions = {
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
    where?: object;
};

// This type is needed for using transactions
export type Database = PrismaClient | Prisma.TransactionClient;

export type DatabaseDelegate<T> = {
    create(args: any): Promise<T>;
    createMany: (args: any) => Promise<{ count: number }>;
    findMany: (args: any) => Promise<any[]>;
};

export type DatabaseCrudDelegate<T> = {
    create(args: any): Promise<T>;
    findUnique(args: any): Promise<T | null>;
    findMany(args: any): Promise<T[]>;
    update(args: any): Promise<T>;
    delete(args: any): Promise<T>;
    count(): Promise<number>;
    findMany(): Promise<T[]>;
    createMany(data: any): Promise<{ count: number }>;
};

export interface CrudRepositoryInterface<TEntity, TCreate, TUpdate = Partial<TCreate>>
{
    create(data: TCreate): Promise<TEntity>;
    update(id: number, data: TUpdate): Promise<TEntity>;
    findById(id: number): Promise<TEntity | null>;
    findByIdOrThrow(id: number): Promise<TEntity>;
    findAll(): Promise<TEntity[]>;
    delete(id: number): Promise<TEntity>;
    count(): Promise<number>;
}

export interface SearchQueryBuilderInterface
{
    build(keyword: string, fields: string[]): ListDbQueryOptions;
}

export interface SortQueryBuilderInterface
{
    build(sort: SortableField, order: ListOrder): ListDbQueryOptions;
}

