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

type ModelInput = {
    name: string;
    props: Map<string, string>;
};

// we get the location of the prisma schema from the prisma config, check if there is a prisma
const prismaSchema = prismaConfig?.schema;

if (!prismaSchema) {
    error('Prisma config schema is missing.');
    closeProcess(1);
}

// we open the prompt for the name of the model and save to an object
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

const modelInput = { 
    name: '',
    props: new Map<string, string>(),
};

const modelName = await waitingForInput('Model name (e.g. AwardScheme): ', modelInput);

if (!modelName) {
    error('The model name cannot be empty.');
    closeProcess(1);
}

modelInput.name = modelName;

rl.write(
    colorize(
        '\nNote: the Id field will be added to the model by default as an autoincrement field.\n', 
        'yellow'
    )
);

await addProperty(modelInput);

async function waitingForInput(question: string, model: ModelInput): Promise<string>
{
    while (true) {
        rl.write(`${colorize(question, 'green')}\n`);
        const input = (await rl.question('')).trim();

        if (input === 'y') {
            createModelFile(model);
        }

        if (!input) {
            const answer = await rl.question(
                colorize(
                    `Are you done with your model? (y/n): `,
                    'yellow'
                )
            );

            if (answer.toLowerCase() === 'y') {
                createModelFile(model);
            }

            continue;
        }

        return input;
    }
}

async function addProperty(model: ModelInput): Promise<void>
{
    const propName = await waitingForInput(
        'Property name (e.g. type):  ', 
        model
    );

    if (modelInput.props.get(propName)) {
        error(`${propName} is already added to the model.`);
        return addProperty(model);
    }

    // @todo: relations

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

    rl.write(
        `${colorize(
            `Valid types are: ${Object.values(prismaTypes).join(', ')}`,
            'yellow'
        )}\n`
    );

    const rawType = await waitingForInput(
        `${propName}'s type: `,
        model
    );

    const propType = prismaTypes[rawType.toLowerCase() as keyof typeof prismaTypes];

    if (!propType) {
        error('Invalid input data.');
        return closeProcess(1);
    }

    if (propType === 'Relation') {
        // add input
    }

    if (propType === 'Enum') {
        // add input
    }

    modelInput.props.set(propName, propType);

    return addProperty(model);
}

function createModelFile(model: ModelInput): never
{
    const prismaPath = prismaSchema!.replace('schema.prisma', 'models')

    const target = path.join(process.cwd(), prismaPath);

    let templateContent = fs.readFileSync(
        new URL(`./model.tpl.ts`, import.meta.url),
        'utf8'
    );
    const modelName = model.name;

    templateContent = templateContent.replace('{{ modelName }}', modelName);

    const fieldStr = [...model.props]
        .map(([fieldName, type]) => `  ${fieldName} ${type}`)
        .join('\n');

    templateContent = templateContent.replace('{{ fieldList }}', fieldStr);

    fs.mkdirSync(
        target,
        { recursive: true }
    );

    const fileName = `${toKebabCase(modelName)}.prisma`;
    const filePath = path.join(target, fileName);
    fs.writeFileSync(
        filePath,
        templateContent.trim()
    );

    rl.write(
        colorize(
            `File has been created at ${filePath}`, 
            'yellow'
        )
    );

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

function error(text: string): void {
    console.error(colorize(text, 'red'));
}





// X we save it to a variable and open then next prompt window and save it into the object's param's variable

// X we open the terminal for that param's type

// X repeat

// X if the user finishes the process we generate the model's structure to the folder structure

// then ask him whether we should ran the prisma:migration and generate commands

// we ran them or exit
