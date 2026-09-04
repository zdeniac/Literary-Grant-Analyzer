import { HttpStatusCode } from "../http/status-codes";
import { AppError } from "./app.error";

export class NotFoundError extends AppError {
    constructor(
        message: string = 'Not Found',
    ) {
        super(message, HttpStatusCode.NOT_FOUND);
        // class name for tracing
        this.name = 'NotFoundError';
    }
}