export const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
} as const;

export function colorize(text: string, color: keyof typeof colors): string
{
    return `${colors[color]}${text}${colors.reset}`;
}
