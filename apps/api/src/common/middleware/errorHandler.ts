import { Request, Response, NextFunction } from "express";
import { ImportValidationError } from "../../modules/data-import/error/import.errors";
import { AppError } from "../errors/app.error";

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void
{
    if (error instanceof ImportValidationError) {
        res.status(error.statusCode).json({
            error: (error as any).code ?? error.message,
            message: error.message,
            errors: error.errors ?? [],
        });

        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        error: 'Internal server error',
    });
}