import { Organization } from "@prisma/client";
import { PrismaRepository } from "../../db/prisma-repository";
import { PrismaModel } from "../../db/types";

export class OrganizationRepository extends PrismaRepository<Organization> {
    constructor(model: PrismaModel<Organization>) {
        super(model);
    }
}