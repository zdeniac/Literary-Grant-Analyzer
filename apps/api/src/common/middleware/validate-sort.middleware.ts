import { NextFunction, Request, Response } from "express";
import { SortableField } from "../types/types";
import { validateSortField } from "../validation/sort-field";
import z from "zod";

export const validateSort = <TField extends SortableField>(validator: z.ZodType<TField>) => (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (req.listQueryParams?.sort) {
        validateSortField(validator, String(req.listQueryParams.sort));
    }

    next();
};