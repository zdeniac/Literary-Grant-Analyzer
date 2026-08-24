export class AppError extends Error
{
    constructor(
        readonly message: string,
        readonly statusCode: number = 500,
        readonly code: string = 'APP_ERROR',
    ) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}