import { writeLine } from "./output";
import { rl } from "./readline";

export async function askInput(question: string): Promise<string>
{
    writeLine(question, 'green');

    const input = (await rl.question(''));

    return input;
}

export async function askYesNo(question: string): Promise<boolean>
{
    const input = (await askInput(`${question} (y/n)`)).toLowerCase();
    return input === 'y';
}

export async function askIfFinished(): Promise<boolean>
{
    return await askYesNo('Are you finished adding properties?');
}

export async function askForAuditFields(): Promise<boolean>
{
    return await askYesNo('Do you want to add audit fields for your model (createdAt, updatedAt)?');
}

export async function askSelect(question: string, options: string[]): Promise<string>
{
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

