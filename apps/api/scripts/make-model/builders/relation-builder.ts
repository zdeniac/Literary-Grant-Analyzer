import { error, writeLine } from "../cli/output";
import { closeProcess } from "../cli/process";
import { askInput, askSelect, askYesNo } from "../cli/prompt";
import { referenceActions, relationTypes } from "../domain/constants";
import { ManyToOneRelationInput, ReferentialAction, RelationInput, RelationType } from "../domain/types";
import { findSuggestedReference } from "./reference-finder";

export async function addRelation(relationProp: string): Promise<RelationInput>
{
    const relationModel = await askRelationModel();
    const type = await askRelationType(relationProp);

    if (type === relationTypes.manyToOne) {
        return {
            field: relationProp,
            model: relationModel,
            property: relationModel.toLowerCase(),
            ...await askManyToOneOptions(relationModel, relationProp),
        };
    }

    return {
        model: relationModel,
        property: relationProp,
    };
}

export async function askRelationModel(): Promise<string>
{
    const model = await askInput('Model name (e.g. Organization):');

    if (!hasModel(model)) {
        error(`No model exists with the given name: ${model}.`);
        return closeProcess(1);
    }

    return model;
}

async function askRelationType(relationProp: string): Promise<RelationType>
{
    writeLine(
        `Valid relation types are: ${Object.values(relationTypes).join(', ')}`,
        'yellow',
    );

    const rawType = await askInput(
        `What type of relation is ${relationProp}?`,
    );

    const relationType = Object.values(relationTypes).find(
        type => type === rawType,
    );

    if (!relationType) {
        error(`Invalid relation type: ${rawType}.`);
        return closeProcess(1);
    }

    return relationType;
}

export async function askManyToOneOptions(model: string, relationProp: string): Promise<ManyToOneRelationInput>
{
    const suggested = findSuggestedReference(model, relationProp);

    if (!suggested) {
        error(`Cannot determine referenced field for ${relationProp} on ${model}.`);
        return closeProcess(1);
    }

    const referenceName = suggested!.name 
        && await askYesNo(`Does ${relationProp} reference ${suggested!.name} on ${model}?`)
            ? suggested!.name
            : await askInput(`Which field does ${relationProp} reference on ${model}?`);

    const actions = Object.values(referenceActions);

    const onDelete = await askSelect(
        'What should happen when the related object is deleted? Valid values', actions
    ) as ReferentialAction;

    const onUpdate = await askSelect(
        'What should happen when the related object is updated?', actions
    ) as ReferentialAction;

    return {
        field: relationProp,
        reference: {
            name: referenceName,
            type: suggested.type,
        },
        referentialActions: {
            onDelete,
            onUpdate,
        },
    };
}