import path from "node:path";
import { writeLine } from "../cli/output";
import { createDirectory, readFile, writeFile } from "../utils/filesystem";
import { toKebabCase } from "../utils/strings";
import { formatAuditFields, formatFields } from "../formatter/field-formatter";
import { ModelInput } from "../domain/types";
import { getPrismaModelsPath } from "../config/prisma.";
import { FieldGenerator } from "./FieldGenerator";

export class ModelGenerator
{
    constructor(
        private readonly fieldGenerator: FieldGenerator,
    ) {}

    generate(model: ModelInput): void
    {
        let template = this.loadTemplate();

        template = template.replace(
            '{{ modelName }}',
            model.name,
        );

        template = template.replace(
            '{{ auditFields }}',
            model.hasAuditFields
                ? formatAuditFields()
                : '',
        );

        template = template.replace(
            '{{ fieldList }}',
            formatFields(
                this.fieldGenerator.generate(model)
            ),
        );

        const target = path.join(process.cwd(), getPrismaModelsPath());

        createDirectory(target);

        const file = path.join(target, `${toKebabCase(model.name)}.prisma`);

        writeFile(file, template.trim());
        writeLine(`File has been created at ${file}`, 'yellow');
    }

    private loadTemplate(): string
    {
        return readFile(new URL('./templates/model.tpl.ts', import.meta.url));
    }
}