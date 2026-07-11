const prismaConfig = {
    modelsPath: 'prisma/models',
    enumsPath: 'prisma/enums',
};

export function getPrismaModelsPath(): string
{
    return prismaConfig.modelsPath;
}

export function getPrismaEnumsPath(): string
{
    return prismaConfig.enumsPath;
}