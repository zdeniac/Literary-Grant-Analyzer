export function parseValidationErrors(properties: Record<string, { errors: string[] }>): Record<string, string> 
{
    return Object.fromEntries(
        Object.entries(properties).map(([field, value]) => [
            field,
            value.errors[0],
        ])
    );
}