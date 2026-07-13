import { HttpError } from "react-admin";
import { parseValidationErrors } from "./parse-errors";

export async function request(
    input: RequestInfo,
    init?: RequestInit
) {
    const response = await fetch(input, init);
    const json = await response.json();

    if (!response.ok) {
        if (json.error === 'VALIDATION_ERROR') {
            throw new HttpError(
                'Validation failed',
                response.status,
                {
                    errors: parseValidationErrors(json.issues.properties),
                }
            );
        }

        throw new HttpError(
            json.error ?? 'Unknown error',
            response.status
        );
    }

    return json;
}