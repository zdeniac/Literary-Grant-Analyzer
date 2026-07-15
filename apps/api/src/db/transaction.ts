import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

export function transaction<T>(
    callback: (tx: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0]) => Promise<T>
): Promise<T> {
    return prisma.$transaction(callback);
}
