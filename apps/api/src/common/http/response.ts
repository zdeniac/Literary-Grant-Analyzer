import { Response } from "express";

export const sendData = <T>(res: Response, data: T, options?: { total?: number }): void =>
    {
        res.json({
            data,
            ...options
        });
    };