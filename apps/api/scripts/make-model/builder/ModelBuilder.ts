import { error, writeLine } from "../cli/output";
import { closeProcess } from "../cli/process";
import { askForAuditFields, askIfFinished, askInput, askYesNo } from "../cli/prompt";
import { prismaTypes } from "../domain/constants";
import { isManyToOneRelationInput } from "../domain/guards";
import { ModelInput, PrismaType } from "../domain/types";
import { RelationBuilder } from "./RelationBuilder";

export class ModelBuilder
{
    private finished = false;

    private readonly model: ModelInput = {
        name: '',
        props: new Map(),
        relations: [],
        hasAuditFields: false,
    };

    constructor(
        private readonly relationBuilder: RelationBuilder
    ) {}

    async build(): Promise<ModelInput>
    {
        await this.addModelName();

        writeLine(
            '\nNote: The id field will be added to the model by default as an autoincrement field.\n',
            'yellow'
        );

        writeLine(
            '      If you want, the wizard will add the audit fields (createdAt, updatedAt).\n',
            'yellow'
        );

        await this.addProperty();

        return this.model;
    }

    async addModelName(): Promise<void>
    {
        const name = await askInput('Model name (e.g. AwardScheme):');
        
        if (!name) {
            error('The model name cannot be empty.');
            closeProcess(1);
        }
        
        this.model.name = name;
    }

    private async addProperty(): Promise<void>
    {
        const propName = await this.waitingForPropertyName();

        if (this.finished || !propName) {
            return;
        }

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
            return this.addProperty();
        }

        if (propType === prismaTypes.relation) {
            const relation = await this.relationBuilder.build(propName);

            this.model.relations.push(relation);

            writeLine(
                `\nRelation added!\n`,
                'yellow'
            );

            // We only save ManyToOne relationships as props
            if (isManyToOneRelationInput(relation)) {
                await this.addScalarProperty(
                    propName, 
                    relation.reference.type
                );
            }

            return this.addProperty();
        }

        if (propType === prismaTypes.enum) {
            /** @todo */
        }

        await this.addScalarProperty(propName, propType);

        return this.addProperty();
    }

    private async addScalarProperty(prop: string, type: PrismaType): Promise<void>
    {
        const optional = await askYesNo(`Is '${prop}' optional?`);
        const unique = await askYesNo(`Is '${prop}' unique?`);

        const defaultVal = await askYesNo(`Has '${prop}' a default value?`)
            ? await askInput(`What is the default value of ${prop}?`)
            : undefined;

        this.model.props.set(prop, {
            type,
            optional,
            unique,
            default: defaultVal,
        });

        writeLine(
            `\n${type} property '${prop}' added!\n`,
            'yellow'
        );
    }

    private async waitingForPropertyName(): Promise<string | null>
    {
        while (true) {
            const input = (
                await askInput("New property's name (e.g. name):")
            ).trim();

            if (this.model.props.has(input)) {
                error(`${input} already exists.`);
                continue;
            }

            if (!input) {
                if (await askIfFinished()) {
                    this.model.hasAuditFields = await askForAuditFields();
                    this.finished = true;
                    return null;
                }

                continue;
            }

            return input;
        }
    }
}