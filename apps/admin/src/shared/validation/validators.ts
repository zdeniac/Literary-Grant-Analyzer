import { type Validator } from "react-admin";

export const url = (message: string = 'Invalid URL'): Validator => (value: any) => {
    if (!value) {
        return undefined;
    }

    try {
        const parsed = new URL(value);

        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return 'Only http(s) URLs are allowed';
        }

        return undefined;
    } catch {
        return message;
    }
};