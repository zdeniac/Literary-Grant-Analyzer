import { {{ pascalCase }} } from "@prisma/client";
import { {{ pascalCase }}Dto } from "../dto/{{ kebabCase }}.dto";
import { Mapper } from "../../../common/types/types";

export const to{{ pascalCase }}Dto: Mapper<{{ pascalCase }}, {{ pascalCase }}Dto> = (
    {{ camelCase }}
) => ({
});
