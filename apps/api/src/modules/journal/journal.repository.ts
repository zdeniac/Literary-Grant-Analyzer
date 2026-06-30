import { Journal } from "@prisma/client";
import { PrismaRepository } from "../../db/prisma-repository";
import { PrismaModel } from "../../db/types";

export class JournalRepository extends PrismaRepository<Journal> {
    constructor(model: PrismaModel<Journal>) {
        super(model);
    }
}