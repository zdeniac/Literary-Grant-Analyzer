import fs from "node:fs";

export function readFile(filePath: string | URL): string
{
    return fs.readFileSync(filePath, 'utf8');
}

export function writeFile(filePath: string, content: string): void
{
    fs.writeFileSync(filePath, content);
}

export function createDirectory(path: string, recursive: boolean = true): void
{
    fs.mkdirSync(path, { recursive });
}

export function readDirectory(directory: string): string[]
{
    return fs.readdirSync(directory);
}