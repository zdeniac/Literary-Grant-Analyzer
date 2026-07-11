import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export const rl = readline.createInterface({
    input: stdin,
    output: stdout,
});