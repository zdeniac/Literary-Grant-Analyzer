import { PrismaConfig } from "../config/PrismaConfig";
import { ParsedSchema, ReferenceField } from "../domain/types";
import { parsePrismaFiles } from "./parser/prisma-parser";

export class PrismaSchema
{
    private parsed: ParsedSchema;

    constructor(prismaConfig: PrismaConfig) {
        this.parsed = parsePrismaFiles(prismaConfig.getModelsPath());
    }

    findSuggestedReference(model: string, prop: string): ReferenceField | undefined 
    {
        const relationModel = this.parsed.get(model);
        const propParts = prop.split(/(?=[A-Z])/);
    
        if (!relationModel) {
            return undefined;
        }
    
        for (const part of propParts) {
            const lowerCase = part.toLowerCase();
    
            const field = relationModel.values.find(
                (field: { name: string; type: string }) =>
                    field.name.toLowerCase().endsWith(lowerCase) ||
                    field.name.toLowerCase().includes(lowerCase)
            );
    
            if (field) {
                return {
                    name: field.name,
                    type: field.type,
                };
            }    
        }
    
        return undefined; 
    }

    hasModel(model: string): boolean
    {
        return this.parsed.has(model);
    }

    hasEnum(enumName: string): boolean
    {
        return this.parsed.has(enumName);
    }
}