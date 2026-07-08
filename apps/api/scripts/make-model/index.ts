import fs from "node:fs";
import prismaConfig from "../../prisma.config";
import readline from "node:readline/promises";
import { stdin, stdout } from 'node:process';
import path from "node:path";

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
} as const;

const referentialActions = {
    cascade: 'Cascade',
    restrict: 'Restrict',
    noAction: 'NoAction',
    setNull: 'SetNull',
    setDefault: 'SetDefault',
} as const;

type ReferentialAction =
    typeof referentialActions[keyof typeof referentialActions];

type RelationInput = {
    model: string;
    property: {
        singular: string;
        plural: string | null;
    };
    type: string;
    field: string;
    reference: string;
    referentialActions: {
        onDelete: ReferentialAction;
        onUpdate: ReferentialAction;
    };
};

type PropertyInput = {
    type: string;
    isOptional: boolean;
};

type ModelInput = {
    name: string;
    props: Map<string, PropertyInput>;
    relations: RelationInput[];
};

const relationTypes = {
    oneToMany: '1:N',
    manyToOne: 'N:1',
} as const;

const prismaTypes = {
    string: 'String',
    boolean: 'Boolean',
    int: 'Int',
    bigint: 'BigInt',
    float: 'Float',
    decimal: 'Decimal',
    datetime: 'DateTime',
    bytes: 'Bytes',
    json: 'Json',
    relation: 'Relation',
    enum: 'Enum',
} as const;

// we get the location of the prisma schema from the prisma config, check if there is a prisma
const prismaSchema = prismaConfig?.schema;

if (!prismaSchema) {
    error('Prisma config schema is missing.');
    closeProcess(1);
}

const modelsPath = prismaSchema.replace('schema.prisma', 'models');
const enumsPath = prismaSchema.replace('schema.prisma', 'enums');

// we open the prompt for the name of the model and save to an object
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

const modelToCreate: ModelInput = { 
    name: '',
    props: new Map(),
    relations: [],
};

const modelName = await askInput('Model name (e.g. AwardScheme): ');

if (!modelName) {
    error('The model name cannot be empty.');
    closeProcess(1);
}

modelToCreate.name = modelName;

writeLine(
    '\nNote: the id field will be added to the model by default as an autoincrement field.\n', 
    'yellow'
);

await addProperty(modelToCreate);

async function askInput(question: string): Promise<string>
{
    while (true) {
        writeLine(question, 'green');

        const input = (await rl.question('')).trim();

        if (input) {
            return input;
        }

        error('Input cannot be empty.');
    }
}

async function waitingForPropertyName(modelInput: ModelInput): Promise<string>
{
    while (true) {
        const input = await askInput('Property name (e.g. name): ');

        if (modelInput.props.has(input)) {
            error(`${input} already exists.`);
            continue;
        }

        return input;
    }
}

async function askIfFinished(): Promise<boolean>
{
    const answer = await askInput('Do you want to add more properties? (y/n): ');

    return answer.toLowerCase() === 'y';
}

async function addProperty(modelInput: ModelInput): Promise<void> 
{
    const propName = await waitingForPropertyName(modelInput);

    writeLine(
        `Valid types are: ${Object.values(prismaTypes).join(', ')}`,
        'yellow'
    );

    const rawType = await askInput(`${propName}'s type: `);

    const propType = prismaTypes[
        rawType.toLowerCase() as keyof typeof prismaTypes
    ];

    if (!propType) {
        error(`Invalid property type: ${rawType}.`);
        return closeProcess(1);
    }

    let isOptional: string | boolean = await askInput(`Is ${propName} optional? (y/n)`);
    isOptional = isOptional === 'y' ? true : false;
    
    modelInput.props.set(
        propName, 
        { 
            type: propType, 
            isOptional 
        },
    );

    if (propType === prismaTypes.relation) {
        const relation = await addRelation(propName);
        modelInput.relations.push(relation);
    }

    if (propType === prismaTypes.enum) {
        // TODO
    }

    if (await askIfFinished()) {
        return createModelFile(modelInput);
    }

    return addProperty(modelInput);
}

async function addRelation(relationProp: string): Promise<RelationInput>
{
    const rawModel = await askInput(`Model name (e.g. Organization):`);

    if (!hasModel(rawModel)) {
        error(`No model exist with the given name: ${rawModel}.`);
        return closeProcess(1);
    }

    writeLine(
        `Valid relation types are: ${Object.values(relationTypes).join(', ')}`,
        'yellow'
    );

    const rawType = await askInput(
        `What type of relation is ${relationProp}:  `, 
    );

    const relationType = Object.values(relationTypes).find(
        value => value === rawType
    );

    if (!relationType) {
        error(`Invalid property type: ${rawType}.`);
        return closeProcess(1);
    }

    const singular = rawModel.toLocaleLowerCase();
    let plural: string | null = null;

    // ask if plural is organizations
    if (relationType === relationTypes.manyToOne) {
        plural = await askInput(
            `Is ${singular}'s plural ${singular}s? (y/n)`
        );

        if (plural === 'y') {
            plural = `${singular}s`;
        } else {
            plural = await askInput(
                `Plural form of ${singular}:`
            );
        }
    }
    
    const reference = await askInput(
        `Which field does ${relationProp} references on ${rawModel}? `, 
    );

    return {
        model: rawModel,
        property: { 
            singular,
            plural,
        },
        field: relationProp, 
        reference,
        referentialActions: {
            onDelete: referentialActions.cascade,
            onUpdate: referentialActions.cascade,
        },
        type: relationType, 
    };
}

function getResources(filesPath: string, resourceType: 'model' | 'enum'): string[]
{
    const files = fs.readdirSync(filesPath)
        .filter(file => file.endsWith('.prisma'));
    
    const fileContents = files.map(
        file => fs.readFileSync(
            path.join(filesPath, file),
            'utf8'
        )
    );

    const regex = new RegExp(
        `${resourceType}\\s+(\\w+)\\s*\\{`,
        'g'
    );

    const resources = fileContents.flatMap(
        file => [...file.matchAll(regex)]
        .map(match => match[1])    
    );

    return resources;
}

function hasModel(model: string): boolean
{
    return getResources(modelsPath, 'model').includes(model);
}

function hasEnum(enumInput: string): boolean
{
    return getResources(enumsPath, 'enum').includes(enumInput);
}

function createModelFile(modelInput: ModelInput): never
{
    const target = path.join(process.cwd(), modelsPath);

    let templateContent = fs.readFileSync(
        new URL(`./model.tpl.ts`, import.meta.url),
        'utf8'
    );

    const modelName = modelInput.name;
    const relations = modelInput.relations;

    templateContent = templateContent.replace('{{ modelName }}', modelName);

    // @todo: make Int changeable! make method part changeable
    let contentStr = '';
    if (relations.length) {
        for (const relation of relations) {
            const isOptionalStr = modelInput.props.get(relation.field)!.isOptional ? '?' : '';

            const relationProp = relation.type === relationTypes.manyToOne 
                ? relation.property.plural
                : relation.property.singular;

            contentStr += `  ${relation.field}  Int${isOptionalStr}`;
            contentStr += `  ${relationProp}    ${relation.model}${isOptionalStr} @relation(fields: [${relation.field}], references[${relation.reference}] onDelete: ${relation.referentialActions.onDelete} onUpdate: ${relation.referentialActions.onUpdate})`;
        }
    } else {
        contentStr = [...modelInput.props]
            .map(([fieldName, prop]) => `  ${fieldName} ${prop.type}${prop.isOptional ? '?' : ''}`)
            .join('\n');
    }

    templateContent = templateContent.replace('{{ fieldList }}', contentStr);

    fs.mkdirSync(
        target,
        { recursive: true, }
    );

    const fileName = `${toKebabCase(modelName)}.prisma`;
    const filePath = path.join(target, fileName);

    fs.writeFileSync(
        filePath,
        templateContent.trim()
    );

    writeLine(`File has been created at ${filePath}`, 'yellow');

    return closeProcess();
}

function toKebabCase(value: string): string
{
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

function closeProcess(code: number = 0): never
{
    rl.close();
    process.exit(code);
}

function colorize(text: string, color: keyof typeof colors): string
{
    return `${colors[color]}${text}${colors.reset}`;
}

function error(text: string): void
{
    console.error(colorize(text, 'red'));
}

function writeLine(text: string, color?: keyof typeof colors): void
{
    rl.write(
        color ? colorize(text, color) + '\n' : text + '\n'
    );
}



// X we save it to a variable and open then next prompt window and save it into the object's param's variable

// X we open the terminal for that param's type

// X repeat

// X if the user finishes the process we generate the model's structure to the folder structure

// then ask him whether we should ran the prisma:migration and generate commands

// we ran them or exit
