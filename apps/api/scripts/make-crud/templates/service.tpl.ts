import { {{ pascalCase }} } from "@prisma/client";
import { Create{{ pascalCase }}Dto, Update{{ pascalCase }}Dto } from "./dto/{{ kebabCase }}.dto";
import { {{ pascalCase }}Repository } from "./{{ kebabCase }}.repository";
import { CrudService } from "../../common/services/crud.service";

export class {{ pascalCase }}Service extends CrudService<{{ pascalCase }}, Create{{ pascalCase }}Dto, Update{{ pascalCase }}Dto>
{
    constructor(
        repository: {{ pascalCase }}Repository
    ) {
        super(repository);
    }
}