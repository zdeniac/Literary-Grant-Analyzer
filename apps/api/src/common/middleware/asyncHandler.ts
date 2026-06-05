import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
    const wrappedHandler = (req: Request, res: Response, next: NextFunction): void => {
        const result = fn(req, res, next);

        Promise.resolve(result).catch(next);
    };

    return wrappedHandler;
};