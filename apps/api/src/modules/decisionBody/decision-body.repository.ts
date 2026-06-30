import { DecisionBody } from "@prisma/client";
import { PrismaRepository } from "../../db/prisma-repository";
import { PrismaModel } from "../../db/types";

export class DecisionBodyRepository extends PrismaRepository<DecisionBody> {
    constructor(model: PrismaModel<DecisionBody>) {
        super(model);
    }
}