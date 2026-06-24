import { PrismaRepository } from "../../db/repository";

export class OrganizationRepository<T> extends PrismaRepository<T> {
    constructor(model: any) {
        super(model);
    }
}