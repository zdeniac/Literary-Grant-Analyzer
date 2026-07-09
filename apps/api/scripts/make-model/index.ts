import fs from "node:fs";
import prismaConfig from "../../prisma.config";
import readline from "node:readline/promises";
import { stdin, stdout } from 'node:process';
import path from "node:path";

/**
 * @todo:
 * - 0. FIX ISSUES
 * - 1. onUpdate, onCreate questions
 * - 2. createdAt, updatedAt fields,
 * - 3. enum handling
 * - 4. refaktor
 */

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
} as const;

const referenceActions = {
    cascade: 'Cascade',
    restrict: 'Restrict',
    noAction: 'NoAction',
    setNull: 'SetNull',
    setDefault: 'SetDefault',
} as const;

type ReferentialAction =
    typeof referenceActions[keyof typeof referenceActions];

type RelationInput = {
    model: string;
    property: {
        singular: string;
        plural: string | null;
    };
    type: string;
    field: string;
    reference: {
        name: string;
        type: ReferenceType;
    };
    referentialActions: {
        onDelete: ReferentialAction;
        onUpdate: ReferentialAction;
    };
};

type ReferenceType = 
    Exclude<keyof typeof prismaTypes, 'relation' | 'boolean' | 'datetime' | 'bytes'>;

type PropertyInput = {
    type: string;
    optional: boolean;
    unique: boolean;
    default?: string;
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

const parsedSchema = parsePrismaFiles(modelsPath);

// we open the prompt for the name of the model and save to an object
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

const model: ModelInput = { 
    name: '',
    props: new Map(),
    relations: [],
};

const modelName = await askInput('Model name (e.g. AwardScheme):');

if (!modelName) {
    error('The model name cannot be empty.');
    closeProcess(1);
}

model.name = modelName;

writeLine(
    '\nNote: the id field will be added to the model by default as an autoincrement field.\n', 
    'yellow'
);

await addProperty(model);

async function askInput(question: string): Promise<string>
{
    writeLine(question, 'green');

    const input = (await rl.question(''));

    return input;
}

async function waitingForPropertyName(model: ModelInput): Promise<string>
{
    while (true) {
        const input = ((await askInput("New property's name (e.g. name):")).trim());

        if (model.props.has(input)) {
            error(`${input} already exists.`);
            continue;
        }

        if (!input) {
            if (await askIfFinished()) {
                createModelFile(model);
            }

            continue;
        }

        return input;
    }
}

async function askYesNo(question: string): Promise<boolean>
{
    const input = (await askInput(`${question} (y/n)`)).toLowerCase();
    return input === 'y';
}

async function askIfFinished(): Promise<boolean>
{
    return await askYesNo('Are you finished adding properties?');
}

async function addProperty(model: ModelInput): Promise<void> 
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
        return closeProcess(1);
    }

    if (propType === prismaTypes.relation) {
        const relation = await addRelation(propName);
        model.relations.push(relation);
        return addProperty(model);
    }

    if (propType === prismaTypes.enum) {
        // TODO
    }

    const optional: boolean = await askYesNo(`Is ${propName} optional?`);
    
    writeLine(`Property: ${propName}`);
    writeLine(`Type: ${propType}`);
    writeLine(`Is optional? ${optional}`);

    const unique: boolean = await askYesNo(`Is ${propName} unique?`);

    const defaultVal = await askYesNo(`Has ${propName} a default value?`)
        ? await askInput(`What is the default value of ${propName}?`)
        : undefined;

    model.props.set(propName, {
        type: propType,
        optional,
        unique,
        default: defaultVal,
    });

    writeLine(
        `\nProperty ${propName} added!.\n`, 
        'yellow'
    );

    return addProperty(model);
}

async function addRelation(relationProp: string): Promise<RelationInput>
{
    const relationModelName = await askInput(`Model name (e.g. Organization):`);

    if (!hasModel(relationModelName)) {
        error(`No model exist with the given name: ${relationModelName}.`);
        return closeProcess(1);
    }

    writeLine(
        `Valid relation types are: ${Object.values(relationTypes).join(', ')}`,
        'yellow'
    );

    const rawType = await askInput(
        `What type of relation is ${relationProp}?`, 
    );

    const relationType = Object.values(relationTypes).find(
        value => value === rawType
    );

    if (!relationType) {
        error(`Invalid property type: ${rawType}.`);
        return closeProcess(1);
    }

    const singular = relationModelName.toLocaleLowerCase();
    let plural = `${singular}s`;

    let isPluralSame = true;

    if (relationType === relationTypes.manyToOne) {
        isPluralSame = await askYesNo(
            `Is ${singular}'s plural ${plural}?`
        );

        if (!isPluralSame) {
            plural = await askInput(
                `Plural form of ${singular}:`
            );
        }
    }
    const suggested = findSuggestedReference(relationModelName, relationProp);
    let ref;

    if (suggested?.name && await askYesNo(`Does ${relationProp} references ${suggested} on ${relationModelName}?`)) {
        ref = suggested.name;
    } 
    else {
        ref = await askInput(
            `Which field does ${relationProp} references on ${relationModelName}?`,
        );
    }

    return {
        model: relationModelName,
        property: { 
            singular,
            plural,
        },
        field: relationProp, 
        reference: {
            name: ref,
            type: suggested.type
        },
        referentialActions: {
            onDelete: referenceActions.cascade,
            onUpdate: referenceActions.cascade,
        },
        type: relationType, 
    };
}

function findSuggestedReference(model: string, prop: string): { name: string; type: ReferenceType; }
{
    const relationModel = parsedSchema.get(model);
    const propParts = prop.split(/(?=[A-Z])/);

    const match: {name: string; type: ReferenceType;} = {
        name: '',
        type: 'Int',
    };

    if (!relationModel) {
        return match;
    }

    for (const part of propParts) {
        relationModel.values.forEach((field: { name: string, type: string}) => {
            if(field.name.includes(part.toLowerCase())) {
                match.name = field.name;
                match.type = field.type;
            }
        });

        if (match.name) break;
    }
    
    return match;
}

function parsePrismaFiles(filesPath: string)
{
    const files = fs.readdirSync(filesPath)
        .filter(file => file.endsWith('.prisma'));

    const fileContents = files.map(file =>
        fs.readFileSync(path.join(filesPath, file), 'utf8')
    );

    const regex = /(model|enum)\s+(\w+)\s*\{([\s\S]*?)\}/g;

    const parsedResources = new Map<string, Record<string, unknown>>();

    for (const file of fileContents) {
        for (const match of file.matchAll(regex)) {
            const resourceType = match[1];
            const resourceName = match[2];
            const body = match[3];

            const lines = body
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean);

            const fieldRegex = resourceType === 'model'
                ? /^(\w+)\s+(\S+)(.*)$/
                : /^(\w+)(.*)$/;

            const values = [];

            for (const line of lines) {
                const lineMatch = line.match(fieldRegex);

                if (!lineMatch) {
                    continue;
                }

                if (resourceType === 'model') {
                    values.push({
                        name: lineMatch[1],
                        type: lineMatch[2],
                        attributes: lineMatch[3].trim(),
                    });
                } else {
                    values.push({
                        name: lineMatch[1],
                        attributes: lineMatch[2].trim(),
                    });
                }
            }

            parsedResources.set(resourceName, {
                file: file,
                type: resourceType,
                values,
            });
        }
    }

    return parsedResources;
}

function hasModel(model: string): boolean
{
    return parsedSchema.has(model);
}

function hasEnum(enumName: string): boolean
{
    return parsedSchema.has(enumName);
}

function createModelFile(model: ModelInput): never
{
    const target = path.join(process.cwd(), modelsPath);

    let templateContent = fs.readFileSync(
        new URL(`./model.tpl.ts`, import.meta.url),
        'utf8'
    );

    const modelName = model.name;
    const relations = model.relations;

    templateContent = templateContent.replace('{{ modelName }}', modelName);

    let contentStr = '';
    if (relations.length) {
        for (const relation of relations) {
            const isOptionalStr = model.props.get(relation.field)!.optional ? '?' : '';

            const relationProp = relation.type === relationTypes.oneToMany 
                ? relation.property.plural
                : relation.property.singular;
            
            const relationSymbol = relation.type === relationTypes.oneToMany
                ? '[]'
                : '';
            
            const modelStr = `${relation.model}${isOptionalStr}${relationSymbol}`;

            contentStr += `  ${relation.field}  ${relation.reference.type}${isOptionalStr}`;
            contentStr += `  ${relationProp}    ${modelStr} @relation(fields: [${relation.field}], references[${relation.reference.name}] onDelete: ${relation.referentialActions.onDelete} onUpdate: ${relation.referentialActions.onUpdate})`;
        }
    } else {
        contentStr = [...model.props]
            .map(([fieldName, prop]) => `  ${fieldName} ${prop.type}${prop.optional ? '?' : ''} ${prop.unique ? '@unique' : ''} ${prop.default ? '@default(' + prop.default + ')' : ''}`)
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
