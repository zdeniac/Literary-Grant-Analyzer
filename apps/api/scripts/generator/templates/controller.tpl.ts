import { {{ pascalCase }} } from "@prisma/client";
import { CrudController } from "../../common/contollers/crud.controller";
import { {{ pascalCase }}Dto } from "./dto/{{ kebabCase }}.dto";
import { {{ pascalCase }}Service } from "./{{ kebabCase }}.service";
import { Mapper } from "../../common/types/types";

export class {{ pascalCase }}Controller extends CrudController<{{ pascalCase }}, {{ pascalCase }}Dto>
{
    constructor(
        service:{{ pascalCase }}Service,
        mapper:Mapper<{{ pascalCase }}, {{ pascalCase }}Dto>
    ) {
        super(service, mapper);
    }
}
