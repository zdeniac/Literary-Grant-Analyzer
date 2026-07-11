import path from "node:path";
import { readDirectory, readFile } from "../../utils/filesystem";
import { ParsedSchema } from "../../domain/types";

export function parsePrismaFiles(filesPath: string): ParsedSchema
{
    const files = readDirectory(filesPath)
        .filter(file => file.endsWith('.prisma'));

    const fileContents = files.map(file =>
        readFile(path.join(filesPath, file))
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
