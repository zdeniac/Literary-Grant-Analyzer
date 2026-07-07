import { prisma } from "../../db/prisma";
import { {{ pascalCase }}Controller } from "./{{ kebabCase }}.controller";
import { {{ pascalCase }}Repository } from "./{{ kebabCase }}.repository";
import { {{ pascalCase }}Service } from "./{{ kebabCase }}.service";
import { to{{ pascalCase }}Dto } from "./mapper/{{ kebabCase }}.mapper";

export const create{{ pascalCase }}Module = () => {
    const service = new {{ pascalCase }}Service(new {{ pascalCase }}Repository(prisma.{{ camelCase }}));
    const controller = new {{ pascalCase }}Controller(service, to{{ pascalCase }}Dto);

    return {
        controller,
    }
};