import { isManyToOneRelationInput, isOneToManyRelationInput } from "../domain/guards";
import { GeneratedField, ModelInput } from "../domain/types";

export class FieldGenerator
{
    generate(model: ModelInput): GeneratedField[]
    {
        const fields: GeneratedField[] = [];
    
        for (const [name, prop] of model.props) {
            const attributes = [
                prop.unique ? '@unique' : '',
                prop.default ? `@default(${prop.default})` : '',
            ];
    
            fields.push({
                name,
                type: `${prop.type}${prop.optional ? '?' : ''}`,
                attributes: attributes
                    .filter(Boolean)
                    .join(' '),
            });
        }
    
        for (const relation of model.relations) {
            if (isManyToOneRelationInput(relation)) {    
                fields.push({
                    name: relation.property,
                    type: `${relation.model}${
                        model.props.get(relation.foreignKey)!.optional ? '?' : ''
                    }`,
                    attributes:
                        `@relation(` +
                        `fields: [${relation.foreignKey}], ` +
                        `references: [${relation.reference!.name}], ` +
                        `onDelete: ${relation.referentialActions!.onDelete}, ` +
                        `onUpdate: ${relation.referentialActions!.onUpdate}` +
                        `)`,
                });
            }
    
            if (isOneToManyRelationInput(relation)) {
                fields.push({
                    name: relation.property,
                    type: `${relation.model}[]`,
                });
            }
        }
    
        return fields;
    }
}