import { GeneratedField } from "../domain/types";

export function formatFields(fields: GeneratedField[]): string
{
    const maxNameLength = Math.max(
        ...fields.map(field => field.name.length)
    );

    const maxTypeLength = Math.max(
        ...fields.map(field => field.type.length)
    );

    return fields
        .map(field => {
            const name = field.name.padEnd(maxNameLength + 2);
            const type = field.type.padEnd(maxTypeLength + 2);

            return `  ${name}${type}${field.attributes ?? ''}`;
        })
        .join('\n');
}

export function formatAuditFields(): string
{
    return formatFields([
        {
            name: 'createdAt',
            type: 'DateTime',
            attributes: '@default(now())',
        },
        {
            name: 'updatedAt',
            type: 'DateTime',
            attributes: '@updatedAt',
        },
    ]);
}

