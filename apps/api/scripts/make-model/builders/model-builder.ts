import { error, writeLine } from "../cli/output";
import { askForAuditFields, askIfFinished, askInput, askYesNo } from "../cli/prompt";
import { prismaTypes } from "../domain/constants";
import { isManyToOneRelationInput } from "../domain/guards";
import { ModelInput, PrismaType, RelationInput } from "../domain/types";
import { createModelFile } from "../generator/model-generator";
import { addRelation } from "./relation-builder";

export async function addProperty(model: ModelInput): Promise<void> 
{
    const propName = await waitingForPropertyName(model);

    writeLine(
        `Valid types are: ${Object.values(prismaTypes).join(', ')}`,
        'yellow'
    );

    const rawType = await askInput(`${propName}'s type:`);
    const propType = prismaTypes[
        rawType.toLowerCase() as keyof typeof prismaTypes
    ];

    if (!propType) {
        error(`Invalid property type: ${rawType}.`);
        return addProperty(model);
    }

    if (propType === prismaTypes.relation) {
        const relation: RelationInput = await addRelation(propName);
        model.relations.push(relation);

        if (isManyToOneRelationInput(relation)) {
            await addScalarProperty(model, propName, relation.reference.type);
            return addProperty(model);
        }
    }

    if (propType === prismaTypes.enum) {
        // TODO
    }

    await addScalarProperty(model, propName, propType);

    return addProperty(model);
}

export async function addScalarProperty(model: ModelInput, prop: string, type: PrismaType): Promise<void>
{
    const optional: boolean = await askYesNo(`Is '${prop}' optional?`);
    const unique: boolean = await askYesNo(`Is '${prop}' unique?`);

    const defaultVal = await askYesNo(`Has '${prop}' a default value?`)
        ? await askInput(`What is the default value of ${prop}?`)
        : undefined;

    model.props.set(prop, {
        type,
        optional,
        unique,
        default: defaultVal,
    });

    writeLine(
        `\n${type} property '${type}' added!\n`, 
        'yellow'
    );
}

export async function waitingForPropertyName(model: ModelInput): Promise<string>
{
    while (true) {
        const input = ((await askInput("New property's name (e.g. name):")).trim());

        if (model.props.has(input)) {
            error(`${input} already exists.`);
            continue;
        }

        if (!input) {
            if (await askIfFinished()) {
                model.hasAuditFields = await askForAuditFields();
                createModelFile(model);
            }

            continue;
        }

        return input;
    }
}

