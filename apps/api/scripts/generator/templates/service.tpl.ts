import { {{ pascalCase }} } from "@prisma/client";
import { Create{{ pascalCase }}Dto, Update{{ pascalCase }}Dto } from "./dto/{{ kebabCase }}.dto";
import { CrudService, IdParam } from "../../common/types/types";
import { {{ pascalCase }}Repository } from "./{{ kebabCase }}.repository";

export class {{ pascalCase }}Service implements CrudService<{{ pascalCase }}>
{
    constructor(
        private readonly repository: {{ pascalCase }}Repository
    ) {}

    create(dto: Create{{ pascalCase }}Dto): Promise<{{ pascalCase }}>
    {
        return this.repository.create(dto);
    }

    findById(id: IdParam): Promise<{{ pascalCase }}>
    {
        return this.repository.findByIdOrThrow(id);
    }

    findAll(): Promise<{{ pascalCase }}[]>
    {
        return this.repository.findAll();
    }

    update(id: IdParam, dto: Update{{ pascalCase }}Dto): Promise<{{ pascalCase }}>
    {
        return this.repository.update(id, dto);
    }

    delete(id: IdParam): Promise<void>
    {
        return this.repository.delete(id);
    }
}