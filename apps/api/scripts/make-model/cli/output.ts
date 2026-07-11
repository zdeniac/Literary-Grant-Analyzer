import { colorize, colors } from "./color";
import { rl } from "./readline";

export function error(text: string): void
{
    console.error(colorize(text, 'red'));
}

export function writeLine(text: string, color?: keyof typeof colors): void
{
    rl.write(
        color ? colorize(text, color) + '\n' : text + '\n'
    );
}
