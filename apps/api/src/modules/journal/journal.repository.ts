import { PrismaRepository } from "../../db/prisma-repository";

export class JournalRepository<T> extends PrismaRepository<T> {
    constructor(model: any) {
        super(model);
    }
}