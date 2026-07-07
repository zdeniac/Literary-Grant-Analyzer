import prismaConfig from "../../prisma.config";
import readline from "node:readline/promises";
import { stdin, stdout } from 'node:process';

// we get the location of the prisma schema from the prisma config, check if there is a prisma
const prismaPath = prismaConfig?.schema;

if (!prismaPath) {
    console.error('Prisma config schema is not set or missing.');
    process.exit(1);
}

// we open the prompt for the name of the model and save to an object
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

const modelInput = { 
    name: '',
    props: new Map(),
};

const model = await waitingForInput(
    'Model name: (e.g. AwardScheme) ',
    'The model name cannot be empty.',
);

modelInput.name = model;

addProperty();

async function waitingForInput(question: string, errorOutput: string, validation?: Function): Promise<string>
{
    while (true) {
        const input = (await rl.question(question)).trim();

        if (!input) {
            console.error(errorOutput);
            continue;
        }

        if (validation && !validation(input)) {
            console.error('Invalid input data.');
            continue;
        }

        return input;
    }
}

async function addProperty() {
    const question = 'Property name: (e.g. name) ';
    const error = 'The property name cannot be empty.';

    const propName = await waitingForInput(question,error,);

    const prismaTypes: string[] = [
        'String',
        'Boolean',
        'Int',
        'BigInt',
        'Float',
        'Decimal',
        'DateTime',
        'Bytes',
        'Json',
    ] as const;

    const propType = await waitingForInput(
        `${propName}'s type: (valid types: ${prismaTypes.join(', ')}) `,
        `${propName}'s type cannot be empty.`,
        (input: string): boolean => prismaTypes.includes(input)
    );

    modelInput.props.set(propName, propType);

    return addProperty();
}





// we save it to a variable and open then next prompt window and save it into the object's param's variable

// we open the terminal for that param's type

// repeat

// if the user finishes the process we generate the model's structure to the folder structure

// then ask him whether we should ran the prisma:migration and generate commands

// we ran them or exit
