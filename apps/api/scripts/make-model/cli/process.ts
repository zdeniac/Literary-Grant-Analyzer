import { rl } from "./readline";

export function closeProcess(code: number = 0): never
{
    rl.close();
    process.exit(code);
}
