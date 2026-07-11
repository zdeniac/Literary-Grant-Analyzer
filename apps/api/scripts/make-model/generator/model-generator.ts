import path from "node:path";
import { writeLine } from "../cli/output";
import { closeProcess } from "../cli/process";
import { ModelInput } from "../domain/types";
import { toKebabCase } from "../utils/strings";
import { formatAuditFields, formatFields } from "../formatter/field-formatter";
import { createDirectory, readFile, writeFile } from "../utils/filesystem";
import { generateFields } from "./field-generator";
import { getPrismaModelsPath } from "../config/prisma.";

export function createModelFile(model: ModelInput): never
{
    let templateContent = readFile(new URL(`./templates/model.tpl.ts`, import.meta.url).toString());

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

    const target = path.join(process.cwd(), getPrismaModelsPath());
    createDirectory(target);

    const filePath = path.join(target, `${toKebabCase(model.name)}.prisma`);

    writeFile(filePath,templateContent.trim());
    writeLine(`File has been created at ${filePath}`, 'yellow');

    return closeProcess();
}
