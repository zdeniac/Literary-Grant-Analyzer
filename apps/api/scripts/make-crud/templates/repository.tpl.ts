import { {{ pascalCase }} } from "@prisma/client";
import { PrismaCrudRepository } from "../../db/prisma-crud-repository";
import { PrismaModel } from "../../db/types";
import { Create{{ pascalCase }}Dto, Update{{ pascalCase }}Dto } from "./dto/{{ kebabCase }}.dto";

export class {{ pascalCase }}Repository extends PrismaCrudRepository<
    {{ pascalCase }}, 
    Create{{ pascalCase }}Dto, 
    Update{{ pascalCase }}Dto 
> {
    constructor(model: PrismaModel<{{ pascalCase }}>) {
        super(model);
    }
}
