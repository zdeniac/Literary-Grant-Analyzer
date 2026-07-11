import { error, writeLine } from "../cli/output";
import { closeProcess } from "../cli/process";
import { askInput, askSelect, askYesNo } from "../cli/prompt";
import { referenceActions, relationTypes } from "../domain/constants";
import { ManyToOneRelationInput, ReferentialAction, RelationInput, RelationType } from "../domain/types";
import { PrismaSchema } from "../schema/PrismaSchema";

export class RelationBuilder
{
    constructor(
        private readonly prismaSchema: PrismaSchema
    ) {}

    async build(relationProp: string): Promise<RelationInput>
    {
        const relationModel = await this.askRelationModel();
        const type = await this.askRelationType(relationProp);

        if (type === relationTypes.manyToOne) {
            return {
                foreignKey: relationProp,
                model: relationModel,
                property: relationModel.toLowerCase(),
                ...await this.askManyToOneOptions(
                    relationModel,
                    relationProp
                ),
            };
        }

        return {
            model: relationModel,
            property: relationProp,
        };
    }

    private async askRelationModel(): Promise<string>
    {
        const model = await askInput('Model name (e.g. Organization):');

        if (!this.prismaSchema.hasModel(model)) {
            error(`No model exists with the given name: ${model}.`);
            return closeProcess(1);
        }

        return model;
    }

    private async askRelationType(relationProp: string): Promise<RelationType>
    {
        writeLine(
            `Valid relation types are: ${Object.values(relationTypes).join(', ')}`,
            'yellow',
        );

        const rawType = await askInput(`What type of relation is ${relationProp}?`);

        const relationType = Object.values(relationTypes)
            .find(type => type === rawType);

        if (!relationType) {
            error(`Invalid relation type: ${rawType}.`);
            return closeProcess(1);
        }

        return relationType;
    }

    private async askManyToOneOptions(model: string, relationProp: string): Promise<ManyToOneRelationInput>
    {
        const suggested = this.prismaSchema.findSuggestedReference(
            model,
            relationProp,
        );

        if (!suggested) {
            error(`Cannot determine referenced field for ${relationProp} on ${model}.`);
            return closeProcess(1);
        }

        const referenceName =
            suggested.name &&
            await askYesNo(`Does ${relationProp} reference ${suggested.name} on ${model}?`)
                ? suggested.name
                : await askInput(
                    `Which field does ${relationProp} reference on ${model}?`
                );


        const actions = Object.values(referenceActions);

        const onDelete =
            await askSelect(
                'What should happen when the related object is deleted?',
                actions
            ) as ReferentialAction;


        const onUpdate =
            await askSelect(
                'What should happen when the related object is updated?',
                actions
            ) as ReferentialAction;

        return {
            foreignKey: relationProp,

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
}