export class AppError extends Error
{
    constructor(
        readonly message: string,
        readonly statusCode: number = 500,
    ) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}