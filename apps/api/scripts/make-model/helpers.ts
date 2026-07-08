import readline from "node:readline/promises";
import { stdin, stdout } from 'node:process';

const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

export function toKebabCase(value: string): string
{
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
} as const;

export function colorize(text: string, color: keyof typeof colors): string
{
    return `${colors[color]}${text}${colors.reset}`;
}

export function error(text: string): void
{
    console.error(colorize(text, 'red'));
}

export function question(text: string): void
{
    rl.question(text);
}

export function writeLine(text: string, color?: keyof typeof colors): void
{
    if (color) {
        colorize(text, color);
    }

    rl.write(`${text}\n`);
}
