import fs from "node:fs";
import prismaConfig from "../../prisma.config";
import readline from "node:readline/promises";
import { stdin, stdout } from 'node:process';
import path from "node:path";

/**
 * @todo:
 * - 0. FIX ISSUES
 * - 1. onUpdate, onDelete questions
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

const relationTypes = {
    oneToMany: '1:N',
    manyToOne: 'N:1',
} as const;

type RelationType = typeof relationTypes[keyof typeof relationTypes];

const referenceActions = {
    cascade: 'Cascade',
    restrict: 'Restrict',
    noAction: 'NoAction',
    setNull: 'SetNull',
    setDefault: 'SetDefault',
} as const;

type ReferentialAction = typeof referenceActions[keyof typeof referenceActions];

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

type PrismaType = typeof prismaTypes[keyof typeof prismaTypes];

type SupportedReferenceType = Exclude<PrismaType, 'boolean' | 'datetime' | 'bytes'>;

type PropertyInput = {
    type: PrismaType;
    optional: boolean;
    unique: boolean;
    default?: string;
};

type ManyToOneRelationInput = RelationInput & ManyToOneOptions;
type OneToManyRelationInput = RelationInput;

type ManyToOneOptions = {
    reference: {
        name: string;
        type: SupportedReferenceType;
    };

    referentialActions: {
        onDelete: ReferentialAction;
        onUpdate: ReferentialAction;
    };
};

type RelationInput = {
    model: string;
    property: string;
    type: RelationType;
    field: string;
};

type ModelInput = {
    name: string;
    props: Map<string, PropertyInput>;
    hasAuditFields: boolean;
    relations: OneToManyRelationInput[] & ManyToOneRelationInput[];
};

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
    hasAuditFields: false,
};

const modelName = await askInput('Model name (e.g. AwardScheme):');

if (!modelName) {
    error('The model name cannot be empty.');
    closeProcess(1);
}

model.name = modelName;

writeLine(
    '\nNote: The id field will be added to the model by default as an autoincrement field.\n', 
    'yellow'
);
writeLine(
    '      If you want, the wizard will add the audit fields (createdAt, updatedAt).\n', 
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
                model.hasAuditFields = await askForAuditFields();
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

async function askForAuditFields(): Promise<boolean>
{
    return await askYesNo('Do you want to add audit fields for your model (createdAt, updatedAt)?');
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
        return addProperty(model);
    }

    if (propType === prismaTypes.relation) {
        const relation = await addRelation(propName);
        model.relations.push(relation);
    }

    if (propType === prismaTypes.enum) {
        // TODO
    }

    const optional: boolean = await askYesNo(`Is '${propName}' optional?`);

    const unique: boolean = await askYesNo(`Is '${propName}' unique?`);

    const defaultVal = await askYesNo(`Has '${propName}' a default value?`)
        ? await askInput(`What is the default value of ${propName}?`)
        : undefined;

    model.props.set(propName, {
        type: propType,
        optional,
        unique,
        default: defaultVal,
    });

    writeLine(
        `\n${propType} property '${propName}' added!\n`, 
        'yellow'
    );

    return addProperty(model);
}

async function addRelation(relationProp: string): Promise<ManyToOneRelationInput | RelationInput>
{
    const model = await askRelationModel();
    const type = await askRelationType(relationProp);

    const manyToOneOptions = type === relationTypes.manyToOne
        ? await askManyToOneOptions(model, relationProp)
        : {
            reference: {},
            referentialActions: {},
        };

    return {
        model,
        property: relationProp,
        field: relationProp,
        type,
        ...manyToOneOptions,
    };
}

async function askRelationModel(): Promise<string>
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

async function askManyToOneOptions(model: string,relationProp: string): Promise<ManyToOneOptions>
{
    const suggested = findSuggestedReference(model, relationProp);

    const referenceName = suggested?.name 
        && await askYesNo(`Does ${relationProp} reference ${suggested.name} on ${model}?`)
            ? suggested.name
            : await askInput(`Which field does ${relationProp} reference on ${model}?`);

    const actions = Object.values(referenceActions);

    const onDelete = await askSelect(
        'What should happen when the related object is deleted? Valid values', actions
    ) as ReferentialAction;

    const onUpdate = await askSelect(
        'What should happen when the related object is updated?', actions
    ) as ReferentialAction;

    return {
        reference: {
            name: referenceName,
            type: suggested?.type,
        },
        referentialActions: {
            onDelete,
            onUpdate,
        },
    };
}

async function askSelect(question: string, options: string[]): Promise<string> {
    writeLine(question, 'green');

    options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
    });

    const answer = await askInput('Choose: ');
    const index = Number(answer) - 1;

    if (!options[index]) {
        throw new Error('Invalid selection');
    }

    return options[index];
}

function findSuggestedReference(model: string, prop: string): { name: string; type: SupportedReferenceType; } | undefined
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
                type: field.type as SupportedReferenceType,
            };
        }    
    }

    return undefined; 
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

    templateContent = templateContent.replace(
        '{{ modelName }}',
        model.name
    );

    templateContent = templateContent.replace(
        '{{ auditFields }}',
        model.hasAuditFields
            ? formatAuditFields()
            : ''
    );

    const fields = generateFields(model);

    templateContent = templateContent.replace(
        '{{ fieldList }}',
        formatFields(fields)
    );

    fs.mkdirSync(target, { recursive: true });

    const fileName = `${toKebabCase(model.name)}.prisma`;
    const filePath = path.join(target, fileName);

    fs.writeFileSync(
        filePath,
        templateContent.trim()
    );

    writeLine(`File has been created at ${filePath}`, 'yellow');

    return closeProcess();
}

function formatFields(fields: GeneratedField[]): string
{
    const maxNameLength = Math.max(
        ...fields.map(field => field.name.length)
    );

    const maxTypeLength = Math.max(
        ...fields.map(field => field.type.length)
    );

    return fields
        .map(field => {
            const name = field.name.padEnd(maxNameLength + 2);
            const type = field.type.padEnd(maxTypeLength + 2);

            return `  ${name}${type}${field.attributes ?? ''}`;
        })
        .join('\n');
}


function formatAuditFields(): string
{
    return formatFields([
        {
            name: 'createdAt',
            type: 'DateTime',
            attributes: '@default(now())',
        },
        {
            name: 'updatedAt',
            type: 'DateTime',
            attributes: '@updatedAt',
        },
    ]);
}

type GeneratedField = {
    name: string;
    type: string;
    attributes?: string;
};

function generateFields(model: ModelInput): GeneratedField[]
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
        if (relation.type === relationTypes.manyToOne) {
            fields.push({
                name: relation.field,
                type: `${relation.reference!.type}${
                    model.props.get(relation.field)!.optional ? '?' : ''
                }`,
            });

            fields.push({
                name: relation.property,
                type: `${relation.model}${
                    model.props.get(relation.field)!.optional ? '?' : ''
                }`,
                attributes:
                    `@relation(` +
                    `fields: [${relation.field}], ` +
                    `references: [${relation.reference!.name}], ` +
                    `onDelete: ${relation.referentialActions!.onDelete}, ` +
                    `onUpdate: ${relation.referentialActions!.onUpdate}` +
                    `)`,
            });
        }

        if (relation.type === relationTypes.oneToMany) {
            fields.push({
                name: relation.property,
                type: `${relation.model}[]`,
            });
        }
    }

    return fields;
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
