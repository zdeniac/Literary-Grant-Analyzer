import { AppError } from "./app.error";

export class InvalidQueryParamError extends AppError
{
    constructor(
        param: string,
        message = `Invalid query parameter: ${param}`,
        statusCode = 400
    ) {
        super(message, statusCode);
        this.name = 'InvalidQueryParamError';
    }
}