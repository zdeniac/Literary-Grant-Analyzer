import path from "node:path";
import { PrismaConfigInternal } from "prisma/config";

export class PrismaConfig
{
    constructor(
        private readonly config: PrismaConfigInternal
    ) {}

    getSchemaPath(): string 
    {
        if (!this.config.schema) {
            throw new Error('Prisma schema path is missing.');
        }

        return this.config.schema;
    }

    getModelsPath(): string
    {
        return path.join(this.getPrismaDirectory(), 'models');
    }

    getEnumsPath(): string
    {
        return path.join(this.getPrismaDirectory(), 'enums');
    }

    private getPrismaDirectory(): string
    {
        const schema = this.getSchemaPath();

        return schema.endsWith('.prisma')
            ? path.dirname(schema)
            : schema;
    }

}