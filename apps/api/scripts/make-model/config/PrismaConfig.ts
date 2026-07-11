import { PrismaConfigInternal } from "prisma/config";

export class PrismaConfig
{
    constructor(
        private readonly config: PrismaConfigInternal
    ) {}

    getSchemaPath(): string
    {
        if (!this.config.schema) {
            throw new Error(
                'Prisma schema path is missing.'
            );
        }

        return this.config.schema;
    }

    getModelsPath(): string
    {
        return this.getSchemaPath()
            .replace(
                'schema.prisma',
                'models'
            );
    }

    getEnumsPath(): string
    {
        return this.getSchemaPath()
            .replace(
                'schema.prisma',
                'enums'
            );
    }
}