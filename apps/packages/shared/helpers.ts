export function strToPascalCase(value: string): string
{
    return value
        .split('-')
        .map(str => str ? str[0].toUpperCase() + str.slice(1) : '')
        .join('');
}
