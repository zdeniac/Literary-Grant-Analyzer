import { Prisma, PrismaClient } from "@prisma/client";
import { GetBatchResult } from "@prisma/client/runtime/client";

export type PrismaDatabase = PrismaClient | Prisma.TransactionClient;

export type ModelDelegate = {
    createMany: (args: any) => Promise<{ count: number }>;
    findMany: (args: any) => Promise<any[]>;
};

export interface CrudRepository<TModel, TCreate, TUpdate>
{
    findById(id: number): Promise<TModel | null>;
    findAll(): Promise<TModel[]>;
    create(data: TCreate): Promise<TModel>;
    delete(id: number): Promise<TModel>;
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
    createMany(data: any): Promise<GetBatchResult>;
};
