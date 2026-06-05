import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodType) => 
	(req: Request, res: Response, next: NextFunction): Response | void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                issues: z.treeifyError(result.error),
            });
        }

		req.body = result.data;
        next();
    };