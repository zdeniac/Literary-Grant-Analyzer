import { {{ pascalCase }} } from "@prisma/client";
import { {{ pascalCase }}Dto } from "../dto/{{ kebabCase }}.dto";
import { DtoMapper } from "../../../common/types/types";

export const to{{ pascalCase }}Dto: DtoMapper<{{ pascalCase }}, {{ pascalCase }}Dto> = (
    {{ camelCase }}
) => ({
});
