import { PrismaRepository } from "../../db/prisma-repository";

export class OrganizationRepository<T> extends PrismaRepository<T> {
    constructor(model: any) {
        super(model);
    }
}