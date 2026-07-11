import { ForeignKeyType, ParsedSchema } from "../domain/types";

export function findSuggestedReference(model: string, prop: string, parsedSchema: ParsedSchema): {  name: string; type: ForeignKeyType; } | undefined 
{
    const relationModel = parsedSchema.get(model);
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
                type: field.type as ForeignKeyType,
            };
        }    
    }

    return undefined; 
}
