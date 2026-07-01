import {{ pascalCase }} from "@prisma/client";
import { PrismaRepository } from "../../db/prisma-repository";
import { PrismaModel } from "../../db/types";

export class {{ pascalCase }}Repository extends PrismaRepository<{{ pascalCase }}> {
    constructor(model: PrismaModel<{{ pascalCase }}>) {
        super(model);
    }
}
